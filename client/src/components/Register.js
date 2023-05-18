import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';

import styles from '../styles/Email.module.css';

export default function Register() {
  const navigate = useNavigate()
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: 'erdem@ay.com',
      username: 'erdem',
      password: 'ay@123'
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || '' });
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Register Successfully...!</b>,
        error: <b>Could not Register</b>
      })

      registerPromise.then(function () { navigate('/') })
    }
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />

      <div className={styles.glass} style={{ width: '80%' }}>
        <div className="title flex flex-col items-center mt-2 mb-2">
          <h4 className="text-4xl font-bold">Register</h4>
          <span className="py-1 text-lg w-2/3 text-center text-gray-500">
            Happy to join you!
          </span>
        </div>

        <form className="py-1" onSubmit={formik.handleSubmit}>
          <div className="profile flex flex-col items-center py-2">
            <label htmlFor="profile">
              <img src={file || avatar} className={styles.profile_img} alt="avatar" />
            </label>
            <input onChange={onUpload} type="file" id="profile" name="profile" />
          </div>

          <div className="textbox flex flex-col items-center gap-4">
            <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder="Email*" />
            <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder="Username*" />
            <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder="Password*" />
            <button className={styles.btn} type="submit">Register</button>
          </div>

          <div className="text-center p-2">
            <span className="text-gray-500">Already Registered? <Link className="text-red-500" to="/">Login Now</Link></span>
          </div>
        </form>
      </div>
    </div>
  );
}
