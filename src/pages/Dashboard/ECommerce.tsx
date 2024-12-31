import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import HomeIcon from '../../../public/assests/HomeIcon.svg'
import PropertyInquiry from '../../../public/assests/PropertyInquiry.svg'
import { ResponsiveContainer, CartesianGrid, Tooltip, YAxis, XAxis } from 'recharts';
import { LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from "../../context/AuthContext";
import { UserGroupIcon, UserIcon} from '@heroicons/react/24/outline';
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
        console.error('Error fetching employee stats:', error);
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
        console.error('Error fetching contact stats:', error);
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
          console.log('Monthly data:', response.data.data);
          setMonthlyMessageCounts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching monthly message counts:', error);
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
        console.error('Error fetching property stats:', error);
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
        console.error('Error fetching inquiry stats:', error);
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
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Date Range Filter</h3>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#af0808]"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#af0808]"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards - These will now show filtered data */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
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
        <div className='flex flex-col lg:flex-row gap-10'>
          <div className="lg:w-[50%] w-full bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Contact Message Analytics</h3>
              <select
                className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#af0808]"
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

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyMessageCounts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="inquiries"
                    stroke="#af0808"
                    strokeWidth={2}
                    name="Messages"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:w-[50%] w-full bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Property Type</h3>
              <select
                className="px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#af0808]"
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
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getLeadSourceData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getLeadSourceData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
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
