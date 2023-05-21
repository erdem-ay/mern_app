import axios from 'axios'
import jwt_decode from "jwt-decode"
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** Make API Requests */


/** To get Email from Token */
export const getEmail = async () => {
    const token = localStorage.getItem('token')
    if (!token) return Promise.reject("Cannot find Token")
    let decode = jwt_decode(token)
    return decode
}

/** authenticate function */
export const authenticate = async (email) => {
    try {
        return await axios.post('/api/authenticate', { email });
    } catch (error) {
        return { error: "Email doesn't exist...!" };
    }
};

/** get User details  */
export const getUser = async ({ username }) => {
    try {
        const { data } = await axios.get(`/api/user/${username}`);
        return { data };
    } catch (error) {
        return { error: "Password doesn't match...!" };
    }
}

/** register user function */
export const registerUser = async (credentials) => {
    try {
        const { data: { msg }, status } = await axios.post('/api/register', credentials);

        const { username, email } = credentials;

        /** Send Mail */
        if (status === 201) {
            await axios.post('/api/registerMail', { username, userEmail: email, text: msg });
        }

        return Promise.resolve(msg);
    } catch (error) {
        return Promise.reject({ error });
    }
};

/** login function */
export const verifyPassword = async ({ email, password }) => {
    try {
        if (email) {
            const { data } = await axios.post('/api/login', { email, password });
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error: "Password doesn't match...!" });
    }
};

/** update user profile function  */
export async function updateUser(response) {
    try {
        const token = localStorage.getItem('token');
        const headers = { "Authorization": `Bearer ${token}` };

        const { data } = await axios.put('/api/updateuser', response, { headers });

        return Promise.resolve(data);
    } catch (error) {
        return Promise.reject(new Error("Couldn't update profile...!"));
    }
}


// Sonrasında hata olursa burada ki Usernameden kaynaklanabilir ****
/** generate OTP */
export async function generateOTP(email) {
    try {
      const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { email } });
  
      // OTP ile bir e-posta gönder
      if (status === 200) {
        const { data: { email, username } } = await getUser({ email });
        console.log(email, username); // Kontrol amaçlı, doğru verileri alıp almadığınızı kontrol edin
        const text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
        await axios.post('/api/registerMail', { userEmail: email, text, subject: "Password Recovery OTP" });
      }
      return code;
    } catch (error) {
      return error;
    }
  }
  





/** verify OTP */
// export const verifyOTP = async (email, code) => {
//     try {
//         const { data, status } = await axios.get('/api/verifyOTP', { params: { email, code } });
//         return { data, status };
//     } catch (error) {
//         return Promise.reject(error);
//     }
// };

export async function verifyOTP({ email, code }) {
    try {
      const response = await axios.get('/api/verifyOTP', {
        params: {
          email: email,
          code: code
        }
      });
      const { status } = response;
      return { status };
      
    } catch (error) {
        return {message: error.response.data.error}
    }
  }
  

/** reset password */
export async function resetPassword({ email, password }) {
    try {
        const { data, status } = await axios.put('/api/resetPassword', { email, password });
        return Promise.resolve({ data, status })
    } catch (error) {
        return Promise.reject({ error })
    }
}