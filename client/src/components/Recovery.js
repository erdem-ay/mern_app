import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from "../store/store";
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from "react-router-dom";
import styles from "../styles/Email.module.css";

export default function Recovery() {
  const { email } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState('');
  const [isOTPGenerated, setIsOTPGenerated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOTPGenerated) {
      generateOTP(email).then((generatedOTP) => {
        console.log(generatedOTP);
        if (generatedOTP) {
          toast.success('OTP has been sent to your email!');
        } else {
          toast.error('Problem while generating OTP!');
        }
      });
    }
  }, [email, isOTPGenerated]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await verifyOTP({ email, code: OTP });
      if (response && response.status === 201) {
        toast.success('Verification Successful!');
        navigate('/reset');
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error('Something went error! Try again')
    }
  }

  function resendOTP() {
    setIsOTPGenerated(true);
  }

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Explore OTP to recover password.
            </span>
          </div>
          <form className="pt-20" onSubmit={handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className='input text-center'>
                <span className='py-4 text-sm text-left text-gray-500'>
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input onChange={(e) => setOTP(e.target.value)} className={styles.textbox} type="text" placeholder='OTP' />
              </div>
              <button className={styles.btn} type='submit'>Sign In</button>
            </div>
          </form>
          <div className="text-center py-4">
            <span className='text-gray-500'>Can't get OTP? <button onClick={resendOTP} className='text-red-500'>Resend</button></span>
          </div>
        </div>
      </div>
    </div>
  )
}
