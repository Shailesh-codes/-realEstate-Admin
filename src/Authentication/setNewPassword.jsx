import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import companyLogo from '../../public/assests/images/CompanyLogo.png';
import Lottie from 'react-lottie';
import signInlottie from '../../public/Lotties/SignInLottieAnimation2.json';
import { Link } from 'react-router-dom';
import api from '../hooks/useApi';

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    console.log("Component mounted");
    console.log("Current URL:", window.location.href);
    console.log("Token from URL:", token);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setMessage("Invalid reset link. Please request a new password reset.");
    } else {
      setMessage('');
    }
  }, [token]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: signInlottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setMessage("Invalid reset token");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${api}/auth/reset-password`, {
        token,
        newPassword
      });
      console.log("Password reset success:", response.data);
      setMessage(response.data.message);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.response?.status === 400) {
        setMessage(error.response?.data?.message || "Invalid or expired reset link. Please request a new one.");
      } else if (error.response?.status === 404) {
        setMessage(error.response?.data?.message || "User not found. Please check your reset link.");
      } else {
        setMessage(error.response?.data?.message || 'Error resetting password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-9999 rounded-sm flex items-center justify-center h-[100vh] border border-stroke bg-white shadow-default">
      <div className="relative flex flex-wrap items-center justify-end w-full mx-2 sm:w-[70%]">
        {/* Left Side Animation - Updated to match ResetPassword */}
        <div className="absolute left-0 z-1 animate-figgle w-full xl:flex xl:w-1/2 h-125 flex items-center justify-center border border-[#c7dbf4] shadow-custom">
          <div className="py-17.5 px-26 text-center">
            <Link to="/" className="flex items-end justify-center space-x-2 mb-5"></Link>
            <p className="mb-1.5 relative text-[] flex items-center justify-center">
              <span className="bg-white px-2 text-sm relative z-10">Find Your Dream Property Today</span>
              <hr className="absolute z-0 top-4 h-[1px] border-[#af0808] b w-[70%]" />
            </p>
            <Lottie options={defaultOptions} height={400} width={400} />
          </div>
        </div>

        {/* Right Side Form - Updated to match ResetPassword */}
        <div className="w-full h-173 relative z-9 py-9 bg-white dark:border-strokedark xl:w-1/2 border border-[#c7dbf4] shadow-custom">
          <div className="w-full p-4 pt-6 xl:px-17.5 flex flex-col gap-5">
            <div className="flex flex-col gap-1 items-center">
              <img src={companyLogo} alt="Real Estate Logo" className="h-12 w-auto" />
              <h2 className="mb-4 text-2xl font- text-black">Set New Password</h2>
              <p className="mb-6 text-center text-gray-500">
                Please enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              <div className="">
                {/* Password inputs with updated styling */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />
                    <span className="absolute right-4 top-4">
                      <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.5">
                          <path d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52188 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11.0688V17.2906Z" fill=""/>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />
                    <span className="absolute right-4 top-4">
                      <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.5">
                          <path d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52188 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11.0688V17.2906Z" fill=""/>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cursor-pointer rounded-lg border bg-[#0b2c3d] p-3 text-white transition hover:bg-opacity-90 disabled:opacity-50"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>

                {message && (
                  <div className="mt-4 text-center text-sm">{message}</div>
                )}

                <div className="mt-6 text-center">
                  <p className="text-[#7a9bbc] text-sm">
                    Remember your password?{' '}
                    <Link to="/" className="text-[#af0808]">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
