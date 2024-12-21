// import React, {useState} from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import companyLogo from '../../public/assests/images/CompanyLogo.png';
// import Lottie from 'react-lottie';
// import signInlottie from '../../public/Lotties/SignInLottieAnimation2.json'

// const ForgotPassword = () => {
//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: signInlottie,
//     rendererSettings: {
//       preserveAspectRatio: 'xMidYMid slice',
//     },
//   };

//   const navigate = useNavigate();
//   const [userType, setUserType] = useState('admin'); // 'admin' or 'employee'

//   return (
//     <div className="fixed top-0 right-0 bottom-0 left-0 z-9999 rounded-sm flex items-center justify-center h-[100vh] border border-stroke bg-white shadow-default">
//       <div className="relative flex flex-wrap items-center justify-end w-full mx-2 sm:w-[70%]">
//         {/* Left Side Animation */}
//         <div className="absolute left-0 z-1 animate-figgle  w-full xl:flex xl:w-1/2 h-125 flex items-center justify-center border border-[#c7dbf4] shadow-custom">
//             <div className="py-17.5 px-26 text-center">
//               <Link
//                 to="/"
//                 className="flex items-end justify-center space-x-2 mb-5"
//               >               
//               </Link>

//               <p className="mb-1.5 relative text-[] flex items-center justify-center">
//                 <span className='bg-white px-2 text-sm relative z-10'>Find Your Dream Property Today</span>
//                 <hr className='absolute z-0 top-4 h-[1px] border-[#af0808] b w-[70%]' />
//               </p>

//               <Lottie options={defaultOptions} height={400} width={400} />
//             </div>
//           </div>

//         {/* Right Side Form */}
//         <div className="w-full h-173 relative z-9 py-9 bg-white dark:border-strokedark xl:w-1/2 border border-[#c7dbf4] shadow-custom">
//           <div className="w-full p-4 pt-6 xl:px-17.5 flex flex-col gap-5">
//            <div className="flex flex-col gap-1 items-center">
//            <img 
//               src={companyLogo}
//               alt="Real Estate Logo"
//               className="h-12 w-auto"
//             />
//             <h2 className="mb-4 text-2xl font- text-black">
//               Forgot Password
//             </h2>
//             <p className="mb-6 text-center text-gray-500">
//               Enter your email address and we'll send you a link to reset your password
//             </p>
//            </div>

//             <form className='flex flex-col gap-10'>
//               {/* User Type Selection */}
//               <div className="mb-7">
//                   {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
//                   User Type
//                 </label> */}
//                   <div className="flex gap-4">
//                     <div
//                       onClick={() => setUserType('admin')}
//                       className={`flex-1 cursor-pointer rounded-lg border p-2 text-center ${userType === 'admin'
//                         ? 'border-[#0b2c3d] bg-[#0b2c3d] text-white'
//                         : 'border-stroke text-black'
//                         }`}
//                     >
//                       Admin
//                     </div>
//                     <div
//                       onClick={() => setUserType('employee')}
//                       className={`flex-1 cursor-pointer rounded-lg border p-2 text-center ${userType === 'employee'
//                         ? 'border-[#0b2c3d] bg-[#0b2c3d] text-white'
//                         : 'border-stroke text-black'
//                         }`}
//                     >
//                       Employee
//                     </div>
//                   </div>
//                 </div>

//              <div className="">
//                {/* Email Input */}
//                <div className="mb-4">
//                 {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
//                   Email
//                 </label> */}
//                 <div className="relative">
//                   <input
//                     type="email"
//                     placeholder="Enter your email"
//                     className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
//                   />
//                   <span className="absolute right-4 top-4">
//                     <svg
//                       className="fill-current"
//                       width="22"
//                       height="22"
//                       viewBox="0 0 22 22"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <g opacity="0.5">
//                         <path
//                           d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
//                           fill=""
//                         />
//                       </g>
//                     </svg>
//                   </span>
//                 </div>
//               </div>

//               <div className="flex justify-center">
//                 <button
//                   onClick={(e)=>{e.preventDefault(); navigate('/dashboard')}}
//                   type="submit"
//                   className="w-full cursor-pointer rounded-lg border bg-[#0b2c3d] p-3 text-white transition hover:bg-opacity-90"
//                 >
//                   Send Reset Link
//                 </button>
//               </div>

//               {/* Back to Sign In Link */}
//               <div className="mt-6 text-center">
//                 <p className='text-[#7a9bbc] text-sm'>
//                   Remember your password?{' '}
//                   <Link to="/" className="text-[#af0808]">
//                     Sign In
//                   </Link>
//                 </p>
//               </div>
//              </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;