import nodemailer from "nodemailer";
import Mailgen from "mailgen";

import ENV from "../config.js"

console.log("Email:", ENV.EMAIL);
console.log("Password:", ENV.PASSWORD);

// https://ethereal.email/create
let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        type: "PLAIN", // Kimlik doğrulama yöntemi
        user: ENV.EMAIL, // Kullanıcı adı
        pass: ENV.PASSWORD // Parola
    }
});

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "email" : "example1375@gmail.com",
  "userEmail" : "admin1375@gmail.com",
  "text" : "",
  "subject" : "",
}
*/
export const registerMail = async (req, res) => {
    const { email, userEmail, text, subject } = req.body

    // body of the email
    let emaill = {
        body: {
            name: email,
            intro: text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    var emailBody = MailGenerator.generate(emaill);

    

    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    }

    // send mail
    transporter.sendMail(message, function (error, info) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "An error occurred while sending the email." });
        } else {
            console.log("Email sent: " + info.response);
            return res.status(200).json({ msg: "You should receive an email from us." });
        }
    });
}