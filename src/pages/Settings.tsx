import { useContext, useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import userThree from '../images/user/user-03.png';
import api from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


interface EmployeeData {
  fullName: string;
  phoneNumber: string;
  email: string;
  username: string;
  bio: string;
  profilePhoto?: string | Blob | File;
}

const Settings = () => {
  const { user } = useAuth();
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    fullName: user?.name || '',
    phoneNumber: '',
    email: user?.email || '',
    username: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(() => {
    // Initialize employeeId from localStorage
    return localStorage.getItem('employeeId');
  });

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      const storedEmployeeId = user?.id || localStorage.getItem('employeeId');

      if (storedEmployeeId) {
        try {
          const response = await fetch(`${api}/employee-info/${storedEmployeeId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setEmployeeData(data);
          setEmployeeId(storedEmployeeId);
        } catch (error) {
          console.error('Error fetching employee data:', error);
          toast.error('Failed to load employee data');
        }
      }
    };

    fetchEmployeeData();
  }, [user]);

  // Modify handleSubmit to store employeeId
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (!employeeId) {
        response = await fetch(`${api}/employee-info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employeeData),
        });
      } else {
        response = await fetch(`${api}/employee-info/${employeeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employeeData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      if (!employeeId) {
        const newEmployeeId = data.employee.id;
        setEmployeeId(newEmployeeId);
        localStorage.setItem('employeeId', newEmployeeId);
      }

      setEmployeeData(data.employee);
      toast.success(employeeId ? 'Profile updated successfully' : 'Employee Information created successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // Add cleanup function when component unmounts (optional)
  useEffect(() => {
    return () => {
      // Cleanup function if needed
    };
  }, []);

  // Handle photo upload
  const handleFileUpload = async (file: File) => {
    if (!employeeId) {
      toast.error('Please save employee information first');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    try {
      console.log('Uploading photo for employee ID:', employeeId);
      console.log('File being uploaded:', file);

      const response = await fetch(`${api}/employee-info/${employeeId}/photo`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload photo');
      }

      if (data.profilePhotoUrl) {
        setEmployeeData(prev => ({
          ...prev,
          profilePhoto: data.profilePhotoUrl
        }));
        toast.success('Photo updated successfully');
      } else {
        throw new Error('No photo URL received from server');
      }
    } catch (error) {
      console.error('Detailed upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload photo');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    await handleFileUpload(e.target.files[0]);
  };

  // Handle photo deletion
  const handleDeletePhoto = async () => {
    try {
      const response = await fetch(`${api}/employee-info/${employeeId}/photo`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete photo');

      setEmployeeData(prev => ({ ...prev, profilePhoto: undefined }));
      toast.success('Photo deleted successfully');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployeeData(prev => ({ ...prev, [name]: value }));
  };

  const createNewEmployee = async () => {
    try {
      const response = await fetch(`${api}/employee-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: employeeData.fullName,
          phoneNumber: employeeData.phoneNumber,
          email: employeeData.email,
          username: employeeData.username,
          bio: employeeData.bio
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create employee');
      }

      // Update the state with the new employee data
      setEmployeeData(data.employee);
      alert('Employee created successfully');
    } catch (error) {
      console.error('Error creating employee:', error);
      alert(error instanceof Error ? error.message : 'Failed to create employee');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        await handleFileUpload(file);
      } else {
        alert('Please upload an image file');
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />


        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-[#af080834] bg-white shadow-default dark:border-[#af080834]dark dark:bg-boxdark">
              <div className="border-b border-[#af080834] py-4 px-7 dark:border-[#af080834]dark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                                fill=""
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                                fill=""
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className="w-full rounded border border-[#af080834]  py-3 pl-11.5 pr-4.5 text-black focus:border-[#af0808] focus-visible:outline-none dark:border-[#af080834]dark dark:bg-meta-4 dark:text-white dark:focus:border-[#af0808]"
                          type="text"
                          name="fullName"
                          value={employeeData.fullName}
                          onChange={handleChange}
                          placeholder="Devid Jhon"
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <input
                        className="w-full rounded border border-[#af080834]  py-3 px-4.5 text-black focus:border-[#af0808] focus-visible:outline-none dark:border-[#af080834]dark dark:bg-meta-4 dark:text-white dark:focus:border-[#af0808]"
                        type="text"
                        name="phoneNumber"
                        value={employeeData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+990 3343 7865"
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        className="w-full rounded border border-[#af080834]  py-3 pl-11.5 pr-4.5 text-black focus:border-[#af0808] focus-visible:outline-none dark:border-[#af080834]dark dark:bg-meta-4 dark:text-white dark:focus:border-[#af0808]"
                        type="email"
                        name="email"
                        value={employeeData.email}
                        onChange={handleChange}
                        placeholder="devidjond45@gmail.com"
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Username"
                    >
                      Username
                    </label>
                    <input
                      className="w-full rounded border border-[#af080834]  py-3 px-4.5 text-black focus:border-[#af0808] focus-visible:outline-none dark:border-[#af080834]dark dark:bg-meta-4 dark:text-white dark:focus:border-[#af0808]"
                      type="text"
                      name="username"
                      value={employeeData.username}
                      onChange={handleChange}
                      placeholder="devidjhon24"
                    />
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="Username"
                    >
                      BIO
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8" clipPath="url(#clip0_88_10224)">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.56524 3.23223C2.03408 2.76339 2.66997 2.5 3.33301 2.5H9.16634C9.62658 2.5 9.99967 2.8731 9.99967 3.33333C9.99967 3.79357 9.62658 4.16667 9.16634 4.16667H3.33301C3.11199 4.16667 2.90003 4.25446 2.74375 4.41074C2.58747 4.56702 2.49967 4.77899 2.49967 5V16.6667C2.49967 16.8877 2.58747 17.0996 2.74375 17.2559C2.90003 17.4122 3.11199 17.5 3.33301 17.5H14.9997C15.2207 17.5 15.4326 17.4122 15.5889 17.2559C15.7452 17.0996 15.833 16.8877 15.833 16.6667V10.8333C15.833 10.3731 16.2061 10 16.6663 10C17.1266 10 17.4997 10.3731 17.4997 10.8333V16.6667C17.4997 17.3297 17.2363 17.9656 16.7674 18.4344C16.2986 18.9033 15.6627 19.1667 14.9997 19.1667H3.33301C2.66997 19.1667 2.03408 18.9033 1.56524 18.4344C1.0964 17.9656 0.833008 17.3297 0.833008 16.6667V5C0.833008 4.33696 1.0964 3.70107 1.56524 3.23223Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_88_10224">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </span>

                      <textarea
                        className="w-full rounded border border-[#af080834]  py-3 pl-11.5 pr-4.5 text-black focus:border-[#af0808] focus-visible:outline-none dark:border-[#af080834]dark dark:bg-meta-4 dark:text-white dark:focus:border-[#af0808]"
                        name="bio"
                        value={employeeData.bio}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Write your bio here"
                        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris tempus ut. Donec fermentum blandit aliquet."
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-[#af080834] py-2 px-6"
                      type="button"
                      onClick={() => setEmployeeData({
                        fullName: '',
                        phoneNumber: '',
                        email: '',
                        username: '',
                        bio: '',
                      })}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded border-[#0b2c3d] bg-[#0b2c3d] hover:bg-[#0b2c3d18] text-white hover:text-[#0b2c3d] transition-colors py-3 px-4 text-sm"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-[#af080834] bg-white shadow-default dark:border-[#af080834]dark dark:bg-boxdark">
              <div className="border-b border-[#af080834] py-4 px-7 dark:border-[#af080834]dark">
                <h3 className="font-medium text-black dark:text-white">
                  Your Photo
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full">
                      {employeeData.profilePhoto ? (
                        <img
                          src={typeof employeeData.profilePhoto === 'string'
                            ? employeeData.profilePhoto
                            : (employeeData.profilePhoto instanceof Blob
                              ? URL.createObjectURL(employeeData.profilePhoto)
                              : userThree)}
                          alt="User"
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <img src={userThree} alt="Default User" />
                      )}
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Edit your photo
                      </span>
                      <span className="flex gap-2.5">
                        <button
                          className="text-sm hover:text-primary"
                          onClick={handleDeletePhoto}
                        >
                          Delete
                        </button>
                        <label className="text-sm hover:text-primary cursor-pointer">
                          Update
                          <input
                            type="file"
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                        </label>
                      </span>
                    </div>
                  </div>

                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-[#af080834]  py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#af080834] bg-white dark:border-[#af080834]dark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-[#af0808]">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-[#af080834] py-2 px-6 font-medium text-black hover:shadow-1 dark:border-[#af080834]dark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center roundedborder border-[#0b2c3d] bg-[#0b2c3d] hover:bg-[#0b2c3d18] text-[white] hover:text-[#0b2c3d] transition-colors py-3 px-4 text-sm"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
