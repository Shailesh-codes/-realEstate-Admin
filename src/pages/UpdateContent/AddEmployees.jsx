import React, { useState, useEffect } from 'react';
import '../../../public/Styles/toggle.css';
import { CiUser } from 'react-icons/ci';
import { MdOutlinePhone } from 'react-icons/md';
import { MdOutlineEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import EyeOpenIcon from '../../../public/assests/EyeOpenIcon.svg';
import EyeCloseIcon from '../../../public/assests/EyeCloseIcon.svg';
import userIcon from '../../../public/assests/user.svg';
import phoneIcon from '../../../public/assests/callicon.svg';
import emailIcon from '../../../public/assests/email.svg';
import passwordIcon from '../../../public/assests/password.svg';
import ArrowLeft from '../../../public/assests/ArrowLeft.svg';
import ArrowRight from '../../../public/assests/ArrowRight.svg';
import toggleoff from '../../../public/assests/toggle-off-stroke-rounded.svg';
import toggleon from '../../../public/assests/toggle-on-stroke-rounded.svg';
import axios from 'axios';
import api from '../../hooks/useApi'

const AddEmployees = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [togglePassword, setTogglePassword] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [showData, setShowData] = useState(true);
  const [activate, setActivate] = useState(true);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    
    // Add validation
    if (!name || !email || !password) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post(
        `${api}/employees/add`,
        {
          name,
          phone,
          email,
          password,
        },
      );

      if (response.data.success) {
        // Add the new employee to the list immediately
        setEmployees(prev => [...prev, response.data.employee]);
        
        // Clear form
        setName('');
        setPhone('');
        setEmail('');
        setPassword('');
        
        // Show success message
        alert('Employee added successfully!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding employee');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${api}/employees/all`);
      if (response.data.success) {
        const formattedEmployees = response.data.employees.map(emp => ({
          ...emp,
          isActive: Boolean(emp.isActive) // Ensure isActive is boolean
        }));
        console.log('Fetched and formatted employees:', formattedEmployees);
        setEmployees(formattedEmployees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const toggleEmployeeStatus = async (employeeId, currentStatus) => {
    console.log('Attempting to toggle status for employee:', employeeId);
    console.log('Current status:', currentStatus);
    
    try {
      const response = await axios.patch(`${api}/employees/toggle-status/${employeeId}`);
      console.log('Server response:', response.data);
      
      if (response.data.success) {
        setEmployees(prevEmployees => 
          prevEmployees.map(emp => 
            emp.id === employeeId 
              ? { ...emp, isActive: !emp.isActive }  // Toggle the current status
              : emp
          )
        );
      }
    } catch (error) {
      console.log('Full error object:', error);
      console.log('Response data:', error.response?.data);
      setEmployees(prevEmployees => [...prevEmployees]); // Force re-render
      alert('Error updating status: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    console.log('Current employees state:', employees);
  }, [employees]);

  return (
    <>
      <div className="flex flex-col gap-14 lg:gap-0">
        <div className="flex justify-center items-center py-4">
          <div className="relative">
            <img
              className="absolute -bottom-2 -left-5 -rotate-90"
              src={ArrowLeft}
              alt=""
            />
            <h1 className="text-xl lg:text-2xl font-bold text-[#0b2c3d] uppercase">
              Add Employees
            </h1>
            <img
              className="absolute -top-2 -right-5 rotate-90"
              src={ArrowLeft}
              alt=""
            />
          </div>
        </div>

        <form
          className=" flex flex-col gap-10 md:p-12"
          onSubmit={handleAddEmployee}
        >
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
                  <div className="w-5">
                    <img src={userIcon} alt="user" />
                  </div>
                </span>
                <input
                  className="w-full rounded border border-[#af080834]  py-3 pl-11.5 pr-4.5 text-black focus:border-[#af0808] focus-visible:outline-none dark:border-[#af080834]dark dark:bg-meta-4 dark:text-white dark:focus:border-[#af0808]"
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="Shailesh"
                  defaultValue="Shailesh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
              <div className="relative">
                <span className="absolute left-4 top-4">
                  <div className="w-5">
                    <img src={phoneIcon} alt="" />
                  </div>
                </span>
                <input
                  className="w-full rounded border border-[#af080834]  py-3 pl-9.5 pr-4.5 text-black focus:border-[#af0808] focus-visible:outline-none dark:border-[#af080834]dark dark:bg-meta-4 dark:text-white dark:focus:border-[#af0808]"
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="   +9903343 7865"
                  defaultValue="     +990 3343 7865"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="fullName"
              >
                Enter Your Email
              </label>
              <div className="relative">
                <span className="absolute left-4.5 top-4">
                  <div className="w-5">
                    <img src={emailIcon} alt="" />
                  </div>
                </span>
                <input
                  className="w-full rounded border border-[#af080834]  py-3 pl-11.5 pr-4.5 text-black focus:border-[#af0808] focus-visible:outline-none dark:border-[#af080834]dark dark:bg-meta-4 dark:text-white dark:focus:border-[#af0808]"
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Shailesh512@gmail.com"
                  defaultValue="Shailesh512@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="phoneNumber"
              >
                Enter Your Password
              </label>
              <div className="relative">
                <span className="absolute left-4.5 top-4">
                  <div className="w-5">
                    <img src={passwordIcon} alt="" />
                  </div>
                </span>
                <input
                  className="w-full rounded border border-[#af080834]  py-3 px-11.5 text-black focus:border-[#af0808] focus-visible:outline-none dark:border-[#af080834]dark dark:bg-meta-4 dark:text-white dark:focus:border-[#af0808]"
                  name="phoneNumber"
                  type={`${togglePassword ? 'text' : 'password'}`}
                  value={password}
                  id="phoneNumber"
                  placeholder="Shailesh@11"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setTogglePassword(!togglePassword)}
                  className="absolute top-3 right-4 cursor-pointer"
                >
                  {togglePassword ? (
                    <img src={EyeOpenIcon} alt="open" />
                  ) : (
                    <img src={EyeCloseIcon} alt="close" />
                  )}
                </span>
              </div>
            </div>
          </div>
          {/* <div className="flex flex-row justify-center gap-8"></div> */}
          <div className="flex justify-center items-center text-lg text-center">
            <button
              type="submit"
              className="bg-[#af0808] hover:bg-gray-600 text-white px-10 py-3 rounded-md"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col mt-5 gap-10">
        <div className="flex justify-center items-center py-4 mt-20">
          <div className="relative">
            <img
              className="absolute -bottom-2 -left-5 -rotate-90"
              src={ArrowLeft}
              alt=""
            />
            <h1 className="text-xl lg:text-2xl font-bold text-[#0b2c3d] uppercase">
              Employees List
            </h1>
            <img
              className="absolute -top-2 -right-5 rotate-90"
              src={ArrowLeft}
              alt=""
            />
          </div>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-3 text-left">Employees Name</th>
                  <th className="px-4 py-3 text-left">Employees Contact No.</th>
                  <th className="px-4 py-3 text-left">Employees Email</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    id={`row-${employee.id}`}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-4 py-3">{employee.name}</td>
                    <td className="px-4 py-3">{employee.phone}</td>
                    <td className="px-4 py-3">{employee.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center items-center">
                        <div className="checkbox-wrapper-51">
                          <input
                            id={`cbx-${employee.id}`}
                            type="checkbox"
                            checked={employee.isActive}
                            onChange={() => toggleEmployeeStatus(employee.id, employee.isActive)}
                            className="toggle-checkbox"
                          />
                          <label className="toggle" htmlFor={`cbx-${employee.id}`}>
                            <span>
                              <svg viewBox="0 0 10 10" height="10px" width="10px">
                                <path d="M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z"></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEmployees;
