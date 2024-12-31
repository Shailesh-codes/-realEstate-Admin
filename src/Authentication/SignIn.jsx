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

const styles = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

const SignIn = ({ userType, setUserType }) => {
  const [passToggle, setPassToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  // const location = useLocation();
  const { setUser } = useAuth();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
    setEmailError('');
    setPasswordError('');

    if (!email.trim() && !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
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
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data.message;
        
        switch (error.response.status) {
          case 400:
            setError(errorMessage || 'Please provide all required fields.');
            break;
          
          case 401:
            if (errorMessage.toLowerCase().includes('user does not exist')) {
              setEmailError('User not found with this email and role');
            } else if (errorMessage.toLowerCase().includes('invalid password')) {
              setPasswordError('Incorrect password');
            } else {
              setError(errorMessage || 'Invalid credentials');
            }
            break;
          
          case 403:
            setError(errorMessage || `Access denied for ${userType}`);
            break;
          
          case 422:
            if (error.response.data.errors) {
              const { email, password } = error.response.data.errors;
              if (email) setEmailError(email);
              if (password) setPasswordError(password);
            }
            break;
          
          case 500:
            setError('Server error. Please try again later.');
            break;
          
          default:
            setError(errorMessage || 'An unexpected error occurred');
        }
      } else if (error.request) {
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleRoleSelection = (role) => {
    setUserType(role);
  }

  return (
    <>
      <style>{styles}</style>
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
                  <div className="text-center mb-4 p-4 text-sm text-red-500 bg-gradient-to-r from-red-50 to-transparent rounded-lg border border-red-100 shadow-sm animate-[fadeIn_0.3s_ease-in-out] flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignIn}>
                  {/* User Type Selection */}
                  <div className="mb-7">
                    <div className="flex gap-4">
                      <div
                        onClick={() => handleRoleSelection('admin')}
                        className={`flex-1 cursor-pointer rounded-lg border p-2 text-center ${
                          userType === 'admin'
                            ? 'border-[#0b2c3d] bg-[#0b2c3d] text-white'
                            : 'border-stroke text-black'
                        }`}
                      >
                        Admin
                      </div>
                      <div
                        onClick={() => handleRoleSelection('employee')}
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
                    <label className="mb-2.5 block font-medium text-[#0b2c3d] transition-all">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className={`w-full rounded-lg border ${
                          emailError ? 'border-red-300 animate-[shake_0.5s_ease-in-out]' : 'border-[#c7dbf4]'
                        } bg-transparent py-4 pl-6 pr-10 text-[#0b2c3d] outline-none focus:border-[#b31a1b] transition-all duration-300 hover:border-[#b31a1b]/50`}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                      {emailError && (
                        <div className="absolute -bottom-6 left-0 text-sm text-red-500 flex items-center gap-1 animate-[fadeIn_0.3s_ease-in-out]">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                          </svg>
                          {emailError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-[#0b2c3d] transition-all">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={passToggle ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className={`w-full rounded-lg border ${
                          passwordError ? 'border-red-300 animate-[shake_0.5s_ease-in-out]' : 'border-[#c7dbf4]'
                        } bg-transparent py-4 pl-6 pr-10 text-[#0b2c3d] outline-none focus:border-[#b31a1b] transition-all duration-300 hover:border-[#b31a1b]/50`}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      {passwordError && (
                        <div className="absolute -bottom-6 left-0 text-sm text-red-500 flex items-center gap-1 animate-[fadeIn_0.3s_ease-in-out]">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                          </svg>
                          {passwordError}
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => setPassToggle(!passToggle)}
                        className="absolute right-4 top-4 cursor-pointer transition-transform hover:scale-110"
                      >
                        {passToggle ? (
                          <img src={EyeOpenIcon} alt="open" className="opacity-60 hover:opacity-100 transition-opacity" />
                        ) : (
                          <img src={EyeCloseIcon} alt="close" className="opacity-60 hover:opacity-100 transition-opacity" />
                        )}
                      </button>
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
                      className="w-[60%] flex items-center justify-center gap-3.5 rounded-lg border border-[#c7dbf4] bg-white p-3 transition-all duration-300 hover:bg-[#0b2c3d] hover:text-white hover:border-[#0b2c3d] transform hover:-translate-y-1 hover:shadow-lg"
                    >
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
