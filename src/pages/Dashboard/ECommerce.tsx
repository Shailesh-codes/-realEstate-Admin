import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import HomeIcon from '../../../public/assests/HomeIcon.svg'
import MoneyIcon from '../../../public/assests/MoneyIcon.svg'
import PropertyInquiry from '../../../public/assests/PropertyInquiry.svg'
import { useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';




const ECommerce: React.FC = () => {
  // Simulated data - Replace with actual API calls
  const [stats, setStats] = useState({
    properties: { total: 245, trend: 12.5 },
    revenue: { total: 1250000, trend: -2.3 },
    inquiries: { total: 156, trend: 4.35 },
    visitors: { total: 1890, trend: 15.2 },
  });

  const [monthlyData] = useState([
    { month: 'Jan', properties: 20, inquiries: 15 },
    { month: 'Feb', properties: 25, inquiries: 18 },
    { month: 'Mar', properties: 30, inquiries: 22 },
    // Add more months...
  ]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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
          title="Monthly Revenue"
          total={`$${(stats.revenue.total).toLocaleString()}`}
          rate={`${stats.revenue.trend}%`}
          rounded={true}
          levelUp={stats.revenue.trend > 0}
        >
          <img src={MoneyIcon} alt="" className="w-8 h-8" />
        </CardDataStats>

        <CardDataStats
          title="Property Inquiries"
          total={stats.inquiries.total.toString()}
          rate={`${stats.inquiries.trend}%`}
          rounded={true}
          levelUp={stats.inquiries.trend > 0}
        >
          <img src={PropertyInquiry} alt="" className="w-8 h-8" />
        </CardDataStats>

        <CardDataStats
          title="Monthly Visitors"
          total={stats.visitors.total.toLocaleString()}
          rate={`${stats.visitors.trend}%`}
          rounded={true}
          levelUp={stats.visitors.trend > 0}
        >
          <FaUsers className="w-8 h-8 text-primary" />
        </CardDataStats>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Property Performance Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Monthly Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="properties" fill="#4318FF" name="Properties" />
                <Bar dataKey="inquiries" fill="#A3AED0" name="Inquiries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Quick Insights</h3>
          <div className="space-y-4">
            {/* Most Viewed Property */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-600">Most Viewed Property</h4>
              <p className="text-lg font-semibold">Luxury Villa in Beverly Hills</p>
              <p className="text-sm text-gray-500">2,345 views this month</p>
            </div>

            {/* Top Performing Area */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-600">Top Performing Area</h4>
              <p className="text-lg font-semibold">Downtown Manhattan</p>
              <p className="text-sm text-gray-500">32 properties sold</p>
            </div>

            {/* Recent Activity */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-600">Recent Activity</h4>
              <ul className="text-sm space-y-2 mt-2">
                <li className="flex items-center gap-2">
                  <MdTrendingUp className="text-green-500" />
                  <span>New property listed: Modern Apartment</span>
                </li>
                <li className="flex items-center gap-2">
                  <MdTrendingDown className="text-red-500" />
                  <span>Price reduced: Beach House</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECommerce;
