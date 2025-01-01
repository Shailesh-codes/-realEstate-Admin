import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import HomeIcon from '../../../public/assests/HomeIcon.svg'
import PropertyInquiry from '../../../public/assests/PropertyInquiry.svg'
import { ResponsiveContainer, CartesianGrid, Tooltip, YAxis, XAxis } from 'recharts';
import { LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from "../../context/AuthContext";
import { UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import api from "../../hooks/useApi";

const COLORS = ['#4be7a3', '#f2b854', '#54cbf2'];

const ECommerce: React.FC = () => {
  // Simulated data - Replace with actual API calls
  const { user } = useAuth();
  const [stats, setStats] = useState({
    properties: { total: 0, trend: 0 },
    inquiries: { total: 0, trend: 0 },
    visitors: { total: 1890, trend: 15.2 },
    employeeSales: { total: 12, trend: 5.8 },
  });

  const [selectedMonth, setSelectedMonth] = useState('all');

  const [contactStats, setContactStats] = useState({
    Buy: 0,
    Sell: 0,
    Rent: 0
  });

  const [monthlyMessageCounts, setMonthlyMessageCounts] = useState([]);

  // Update the contact stats state to include dates
  const [contactMessages, setContactMessages] = useState([]);

  const [employeeStats, setEmployeeStats] = useState({
    active: 0,
    inactive: 0
  });

  // Add date range state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Add this new useEffect to fetch employee stats
  useEffect(() => {
    const fetchEmployeeStats = async () => {
      try {
        const response = await axios.get(`${api}/employees/all`, {
          withCredentials: true
        });

        if (response.data.success) {
          const activeCount = response.data.employees.filter(emp => emp.isActive).length;
          const inactiveCount = response.data.employees.filter(emp => !emp.isActive).length;

          setEmployeeStats({
            active: activeCount,
            inactive: inactiveCount
          });
        }
      } catch (error) {

      }
    };

    if (user?.role === "admin") {
      fetchEmployeeStats();
    }
  }, [user]);

  // Update the contact stats state to include dates
  useEffect(() => {
    const fetchContactStats = async () => {
      try {
        const response = await axios.get(`${api}/contact/getcontact`, {
          withCredentials: true
        });

        if (response.data.success) {
          setContactMessages(response.data.data); // Store all messages

          // Calculate initial stats (all months)
          const stats = response.data.data.reduce((acc, message) => {
            acc[message.purpose] = (acc[message.purpose] || 0) + 1;
            return acc;
          }, {});

          setContactStats({
            Buy: stats.Buy || 0,
            Sell: stats.Sell || 0,
            Rent: stats.Rent || 0
          });
        }
      } catch (error) {

      }
    };

    fetchContactStats();
  }, []);

  useEffect(() => {
    const fetchMonthlyMessageCounts = async () => {
      try {
        const response = await axios.get(`${api}/contact/monthly-stats`, {
          withCredentials: true
        });

        if (response.data.success) {
          setMonthlyMessageCounts(response.data.data);
        }
      } catch (error) {
      }
    };

    fetchMonthlyMessageCounts();
  }, []);

  // Modify the property stats fetch
  useEffect(() => {
    const fetchPropertyStats = async () => {
      try {
        const response = await axios.get(`${api}/properties/stats`, {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          },
          withCredentials: true
        });

        if (response.data.success) {
          setStats(prevStats => ({
            ...prevStats,
            properties: response.data.stats
          }));
        }
      } catch (error) {

      }
    };

    fetchPropertyStats();
  }, [dateRange]);

  // Modify the inquiry stats fetch
  useEffect(() => {
    const fetchInquiryStats = async () => {
      try {
        const response = await axios.get(`${api}/contact/getcontact`, {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          },
          withCredentials: true
        });

        if (response.data.success) {
          const filteredInquiries = response.data.data.filter(inquiry => {
            const inquiryDate = new Date(inquiry.createdAt);
            return inquiryDate >= new Date(dateRange.startDate) &&
              inquiryDate <= new Date(dateRange.endDate);
          });

          setStats(prevStats => ({
            ...prevStats,
            inquiries: {
              total: filteredInquiries.length,
              trend: 0 // Calculate trend if needed
            }
          }));
        }
      } catch (error) {

      }
    };

    fetchInquiryStats();
  }, [dateRange]);

  // Filter data based on selected month
  const getFilteredData = () => {
    if (selectedMonth === 'all') return contactMessageData;

    return contactMessageData.filter(item => {
      const date = new Date(item.date);
      return date.getMonth() === parseInt(selectedMonth) - 1;
    });
  };

  // Get lead source data based on selected month
  const getLeadSourceData = () => {
    // Filter messages based on selected month
    const filteredMessages = contactMessages.filter(message => {
      if (selectedMonth === 'all') return true;

      const date = new Date(message.createdAt); // Assuming your message has createdAt field
      return date.getMonth() === parseInt(selectedMonth) - 1;
    });

    // Calculate stats from filtered messages
    const stats = filteredMessages.reduce((acc, message) => {
      acc[message.purpose] = (acc[message.purpose] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'Buy', value: stats.Buy || 0 },
      { name: 'Sell', value: stats.Sell || 0 },
      { name: 'Rent', value: stats.Rent || 0 }
    ];
  };

  // Sample contact message data (replace with actual data later)
  const contactMessageData = [
    { date: '2024-01-01', count: 15 },
    { date: '2024-01-05', count: 8 },
    { date: '2024-01-10', count: 12 },
    { date: '2024-01-15', count: 20 },
    { date: '2024-01-20', count: 18 },
    { date: '2024-01-25', count: 25 },
    { date: '2024-02-01', count: 10 },
    { date: '2024-02-05', count: 15 },
    { date: '2024-02-10', count: 22 },
    { date: '2024-02-15', count: 18 },
    { date: '2024-02-20', count: 30 },
    { date: '2024-02-25', count: 28 },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Date Range Selector - Update responsive classes */}
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h3 className="text-sm md:text-lg lg:text-xl font-semibold">Date Range Filter</h3>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full sm:w-auto px-2 py-1.5 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-1 lg:focus:ring-2 focus:ring-[#af0808]"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full sm:w-auto px-2 py-1.5 md:py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-1 lg:focus:ring-2 focus:ring-[#af0808]"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards - Update grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <CardDataStats
          title="Total Properties"
          total={stats.properties.total.toString()}
          rate={`${stats.properties.trend}%`}
          rounded={true}
          levelUp={stats.properties.trend > 0}
        >
          <img src={HomeIcon} alt="" className="w-8 h-8" />
        </CardDataStats>

        <CardDataStats
          title="Property Inquiries"
          total={stats.inquiries.total.toString()}
          rate=''
          rounded={true}
          levelUp={stats.inquiries.trend > 0}
        >
          <img src={PropertyInquiry} alt="" className="w-8 h-8" />
        </CardDataStats>

        {user?.role === "admin" && (
          <CardDataStats
            title="No. of Active Employees"
            total={employeeStats.active.toString()}
            rate=""
            rounded={true}
            levelUp={false}
          >
            <UserIcon className="w-8 h-8 text-[#af0808]" />
          </CardDataStats>
        )}

        {user?.role === "admin" && (
          <CardDataStats
            title="No. of Deactive Employees"
            total={employeeStats.inactive.toString()}
            rate=""
            rounded={true}
            levelUp={false}
          >
            <UserGroupIcon className="w-8 h-8 text-[#af0808]" />
          </CardDataStats>
        )}
      </div>

      {user?.role === "admin" && (
        <div className='flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-10'>
          {/* Chart Container 1 - Enhanced Line Chart */}
          <div className="w-full lg:w-[50%] bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 md:mb-6">
              <h3 className="text-sm md:text-lg lg:text-xl font-semibold text-gray-800">
                Contact Message Analytics
                <span className="block text-xs text-gray-500 font-normal mt-1">Monthly message distribution</span>
              </h3>
              <select
                className="w-full sm:w-auto text-xs md:text-sm lg:text-base px-3 py-2 border rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-[#af0808] bg-white shadow-sm
                           transition-all duration-200 ease-in-out hover:border-[#af0808]"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="all">All Months</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <div className="h-60 md:h-70 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyMessageCounts}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#af0808" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#af0808" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={{ stroke: '#ccc' }}
                  />
                  <YAxis
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={{ stroke: '#ccc' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="inquiries"
                    stroke="#af0808"
                    strokeWidth={3}
                    name="Messages"
                    dot={{ stroke: '#af0808', strokeWidth: 2, r: 4, fill: 'white' }}
                    activeDot={{ r: 6, stroke: '#af0808', strokeWidth: 2, fill: 'white' }}
                    fill="url(#colorInquiries)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart Container 2 - Enhanced Pie Chart */}
          <div className="w-full lg:w-[50%] bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 md:mb-6">
              <h3 className="text-sm md:text-lg lg:text-xl font-semibold text-gray-800">
                Property Type
                <span className="block text-xs text-gray-500 font-normal mt-1">Distribution by category</span>
              </h3>
              <select
                className="w-full sm:w-auto text-xs md:text-sm lg:text-base px-3 py-2 border rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-[#af0808] bg-white shadow-sm
                           transition-all duration-200 ease-in-out hover:border-[#af0808]"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="all">All Months</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <div className="h-60 md:h-70 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getLeadSourceData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    {getLeadSourceData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ECommerce;
