import UserModel from '../model/User.model.js'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import ENV from "../config.js"
import otpGenerator from 'otp-generator';




/** middleware for verify email */
export const verifyEmail = async (req, res, next) => {
    try {

        const { email } = req.method == "GET" ? req.query : req.body;

        // check the email existance
        let exist = await UserModel.findOne({ email })
        if (!exist) return res.status(404).send({ error: "Can't find Email" })
        next()
    } catch (error) {
        return res.status(404).send({ error: 'Authentication Error' })
    }
}

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export const register = async (req, res) => {
    try {
        const { username, password, profile, email } = req.body;

        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(404).json({ error: 'Email or username already exists' })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const newUser = new UserModel({
            email,
            username,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        return res.status(200).json({ response: newUser })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}


/** POST: http://localhost:8080/api/login 
 * @param: {
  "email": "example@gmail.com",
  "password" : "admin123"
}
*/
export const login = async (req, res) => {
    const { email, password } = req.body;

    // Find the user with the specified email
    const user = await UserModel.findOne({ email });
    console.log(user);

    if (!user) {
        return res.status(401).json({ message: 'Email not found' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Password does not Match" });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    return res.status(200).json({ username: user.username, msg: "Login Successful", token });
}

function generateToken(userId) {
    // Generate JWT token here
    // This is just an example using the 'jsonwebtoken' library
    const token = jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: '1h' });
    return token;
}



/** GET: http://localhost:8080/api/user/example123 */
export const getUser = async (req, res) => {

    const { email } = req.params;
    
    console.log(email)

    try {
        // Find the user with the specified username
        const user = await UserModel.findOne({ email });

        if (!user) {
            // If user does not exist, return 404 Not Found status
            return res.status(404).json({ message: 'User not found' });
        }

        // If user exists, return the user information
        return res.status(200).json(user);
    } catch (err) {
        // If there is an error, return 500 Internal Server Error status
        return res.status(500).json({ message: err.message });
    }
}


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export const updateUser = async (req, res) => {

    // const userId = req.params.id;
    const { userId } = req.user;
    console.log("user;ID", userId)

    if (!userId) {
        return res.status(401).send({ error: "User Not Found...!" });
    }

    const body = req.body;

    UserModel.updateOne({ _id: userId }, body)
        .then(() => {
            return res.status(201).json({ msg: "Record Updated...!" });
        })
        .catch((error) => {
            return res.status(500).json({ error });
        });
}


/** GET: http://localhost:8080/api/generateOTP */
export const generateOTP = async (req, res) => {
    req.app.locals.OTP = await otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, alphabets: false, upperCase: false, specialChars: false });
    res.status(201).json({ code: req.app.locals.OTP });
};

/** GET: http://localhost:8080/api/verifyOTP */
export const verifyOTP = async (req, res) => {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).json({ msg: 'Verification successful!' });
    }
    return res.status(400).json({ error: 'Invalid OTP' });
};


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export const createResetSession = async (req, res) => {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false; // allow access to this route only once
        return res.status(201).json({ msg: "Access granted!" });
    }
    return res.status(440).json({ error: "Session expired!" });
};


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export const resetPassword = async (req, res) => {
    try {
        if (!req.app.locals.resetSession)
            return res.status(440).json({ error: "Session expired!" });

        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Email not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.updateOne(
            { email: user.email },
            { password: hashedPassword }
        );

        req.app.locals.resetSession = false; // reset session

        return res.status(201).json({ msg: "Password reset successfully!" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}