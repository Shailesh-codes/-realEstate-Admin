import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import companyLogo from '../../public/assests/images/CompanyLogo.png';
import EyeOpenIcon from '../../public/assests/EyeOpenIcon.svg';
import EyeCloseIcon from '../../public/assests/EyeCloseIcon.svg';
import Lottie from 'react-lottie';
import signInlottie from '../../public/Lotties/SignInLottieAnimation2.json';
import api from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SignIn = ({ userType, setUserType }) => {
  const [passToggle, setPassToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: signInlottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const [pageView, setPageView] = useState('SignIn');

  function HandlePageView() {
    navigate('/resetpassword');
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    // Enhanced form validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post(
        `${api}/auth/login`,
        {
          email,
          password,
          role: userType,
          rememberMe: rememberMe,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setUser(response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // Handle specific error responses from server
        switch (error.response.status) {
          case 401:
            setError('Invalid email or password.');
            break;
          case 403:
            setError('Access denied. Please check your credentials.');
            break;
          case 404:
            setError('User not found.');
            break;
          default:
            setError('An error occurred during sign in. Please try again.');
        }
      } else if (error.request) {
        // Network error
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <>
      <div className="fixed top-0 right-0 bottom-0 left-0 z-9999 rounded-sm flex items-center justify-center h-[100vh] border border-stroke bg-white shadow-default">
        <div className="relative flex flex-wrap items-center justify-end w-full mx-2 sm:w-[70%]">
          <div className="absolute left-0 z-1 animate-figgle  w-full xl:flex xl:w-1/2 h-125 flex items-center justify-center border border-[#c7dbf4] shadow-custom">
            <div className="py-17.5 px-26 text-center">
              <Link
                to="/"
                className="flex items-end justify-center space-x-2 mb-5"
              ></Link>

              <p className="mb-1.5 relative text-[] flex items-center justify-center">
                <span className="bg-white px-2 text-sm relative z-10">
                  Find Your Dream Property Today
                </span>
                <hr className="absolute z-0 top-4 h-[1px] border-[#af0808] b w-[70%]" />
              </p>

              <Lottie options={defaultOptions} height={400} width={400} />
            </div>
          </div>

          <div className="w-full h-173 relative z-9 bg-white xl:w-1/2 border border-[#c7dbf4] shadow-custom">
            {pageView === 'SignIn' ? (
              <div className="w-full p-4 py-8 xl:px-17.5">
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={companyLogo}
                    alt="Real Estate Logo"
                    className="h-12 w-auto"
                  />
                  <span className="mb-1.5 block font-medium text-[#]">
                    Welcome Back
                  </span>
                  <h2 className="mb-9 text-2xl font text-[#0b2c3d]">
                    Sign In to Your Account
                  </h2>
                </div>

                {error && (
                  <div className="text-center mb-4 p-3 text-sm text-red-500 bg-red-100 rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignIn}>
                  {/* User Type Selection */}
                  <div className="mb-7">
                    <div className="flex gap-4">
                      <div
                        onClick={() => setUserType('admin')}
                        className={`flex-1 cursor-pointer rounded-lg border p-2 text-center ${
                          userType === 'admin'
                            ? 'border-[#0b2c3d] bg-[#0b2c3d] text-white'
                            : 'border-stroke text-black'
                        }`}
                      >
                        Admin
                      </div>
                      <div
                        onClick={() => setUserType('employee')}
                        className={`flex-1 cursor-pointer rounded-lg border p-2 text-center ${
                          userType === 'employee'
                            ? 'border-[#0b2c3d] bg-[#0b2c3d] text-white'
                            : 'border-stroke text-black'
                        }`}
                      >
                        Employee
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-[#0b2c3d]">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-[#c7dbf4] bg-transparent py-4 pl-6 pr-10 text-[#0b2c3d] outline-none focus:border-[#b31a1b]"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                        }}
                      />
                      <span className="absolute right-4 top-4">
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.5">
                            <path
                              d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-[#0b2c3d]">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={passToggle ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="w-full rounded-lg border border-[#c7dbf4] bg-transparent py-4 pl-6 pr-10 text-[#0b2c3d] outline-none focus:border-[#b31a1b]"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                        }}
                      />

                      <span
                        onClick={() => {
                          setPassToggle(!passToggle);
                        }}
                        className="absolute right-4 top-4 cursor-pointer"
                      >
                        {passToggle ? (
                          <img src={EyeOpenIcon} alt="open" />
                        ) : (
                          <img src={EyeCloseIcon} alt="close" />
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-2">
                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        className="cursor-pointer"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="text-[#8eadcb] hover:text-[#7a9bbc] text-sm select-none">
                        Remember me
                      </span>
                    </div>

                    <div className="cursor-pointer" onClick={HandlePageView}>
                      <span className="text-[#8eadcb] hover:text-[#7a9bbc] text-sm">
                        Forgot Password?
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="submit"
                      className=" w-[60%] flex items-center justify-center gap-3.5 rounded-lg border border-[#c7dbf4] bg-white p-3 hover:bg-gray-50"
                    >
                      <span></span>
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 pt-6 xl:px-17.5">
                <h2 className="mb-8 text-2xl font-bold text-[#0b2c3d]">
                  Reset Password
                </h2>

                <form className="w-full space-y-6">
                  <div>
                    <label className="mb-2.5 block font-medium text-[#0b2c3d]">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-[#c7dbf4] bg-transparent py-4 pl-6 pr-10 text-[#0b2c3d] outline-none focus:border-[#b31a1b]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#b31a1b] p-4 text-white transition hover:bg-[#0b2c3d]"
                  >
                    Send Reset Link
                  </button>

                  <div className="text-center">
                    <span
                      className="text-[#b31a1b] cursor-pointer hover:underline"
                      onClick={() => setPageView('SignIn')}
                    >
                      Back to Sign In
                    </span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

// >>>>>> ResetPassword.jsx
