import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from "../store/store"
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from "react-router-dom"
import styles from "../styles/Email.module.css"

export default function Recovery() {

  const { email } = useAuthStore(state => state.auth)
  const [OTP, setOTP] = useState()

  const navigate = useNavigate()


  useEffect(() => {
    generateOTP(email).then((generatedOTP) => {
      console.log(generatedOTP); // Kontrol amaçlı, generateOTP fonksiyonundan dönen değeri kontrol edin
      if (generatedOTP) {
        toast.success('OTP has been sent to your email!');
      } else {
        toast.error('Problem while generating OTP!');
      }
    });
  }, [email]);

  async function onSubmit(e) {
    e.preventDefault();
  
    let { status } = await verifyOTP({ email, code: OTP });
    
    if (status === 200 || status === 201) {
      toast.success('Verification Successful!');
      return navigate('/reset');
    } else {
      toast.error('Wrong OTP! Check your email again');
    }
  }
  

  // handler of resend OTP
  function resendOTP() {
    let sentPromise = generateOTP(email);

    toast.promise(sentPromise,
      {
        loading: 'Sending...',
        success: <b>OTP has been send to your email!</b>,
        error: <b>Could not Send it!</b>,
      }
    );

    sentPromise.then((OTP) => {
      console.log(OTP)
    });
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


          <form className="pt-20" onSubmit={onSubmit}>

            <div className="textbox flex flex-col items-center gap-6">

              <div className='input text-center'>
                <span className='py-4 text-sm text-left text-gray-500'>
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input onChange={(e) => setOTP(e.target.value)} className={styles.textbox} type="text" placeholder='OTP' />
              </div>
              <button className={styles.btn} type='submit'>Sign In</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>Can't get OTP? <button onClick={resendOTP} className='text-red-500'>Resend</button></span>
            </div>

          </form>


        </div>
      </div>
    </div>
  )
}
