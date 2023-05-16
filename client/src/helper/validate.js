import toast from "react-hot-toast";
import { authenticate } from "./helper"

/** validate login page email / username */
export const emailValidate = async (values) => {
    const errors = emailVerify({}, values)

    if (values.email) {
        // check email exist or not
        const { status } = await authenticate(values.email)

        if(status !== 200){
        errors.exist = toast.error('User does not exist...!')
        }
    }

    return errors;
}

/** validate password */
export async function passwordValidate(values) {
    const errors = passwordVerify({}, values)

    return errors;
}

/**validate reset password */
export async function resetPasswordValidation(values) {
    const errors = passwordVerify({}, values)

    if (values.password !== values.confirm_pwd) {
        errors.exist = toast.error("Password not match...!")
    }

    return errors;
}

/** validate register form */
export async function registerValidation(values) {
    const errors = emailVerify({}, values);
    passwordVerify(errors, values);
    emailVerifyy(errors, values);

    return errors;
}

/** validate profile page */
export async function profileValidation(values) {
    const errors = emailVerifyy({}, values);
    return errors;
}


/**************************************** */

/** validate password */
function passwordVerify(errors = {}, values) {
    /* eslint-disable no-useless-escape */
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (!values.password) {
        errors.password = toast.error("Password Required...!");
    } else if (values.password.includes(" ")) {
        errors.password = toast.error("Wrong Password...!");
    } else if (values.password.length < 4) {
        errors.password = toast.error("Password must be more than 4 characters long");
    } else if (!specialChars.test(values.password)) {
        errors.password = toast.error("Password must have special character");
    }

    return errors;
}

/**validate email / username */
function emailVerify(error = {}, values) {
    if (!values.email) {
        error.email = toast.error('Email Required...!')
    } else if (values.email.includes(" ")) {
        error.email = toast.error('Invalid Email...!')
    }

    return error;
}

/** validate email */
function emailVerifyy(error = {}, values) {
    if (!values.email) {
        error.email = toast.error("Email Required...!");
    } else if (values.email.includes(" ")) {
        error.email = toast.error("Wrong Email...!")
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        error.email = toast.error("Invalid email address...!")
    }

    return error;
}