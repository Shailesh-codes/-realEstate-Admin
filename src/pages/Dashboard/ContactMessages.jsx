import React, { useState, useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import EyeIcon from '../../../public/assests/EyeIcon.svg'
import DeleteIcon from '../../../public/assests/DeleteIcon.svg'
import ClosedEyeIcon from '../../../public/assests/ClosedEyeIcon.svg'
import ArrowLeft from '../../../public/assests/ArrowLeft.svg'
import ArrowRight from '../../../public/assests/ArrowLeft.svg'
import { FaSort } from 'react-icons/fa';
import axios from 'axios';

const ContactMessages = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntries, setSelectedEntries] = useState(10);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [message, setMessage] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const messagesPerPage = selectedEntries;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://192.168.1.8:8080/api/v1/contact/getcontact', {
          withCredentials: true
        });
        if (response.data.success) {
          setMessages(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const filteredMessages = messages.filter((message) =>
    message.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedMessages = sortConfig.key
    ? sortData(filteredMessages, sortConfig.key, sortConfig.direction)
    : filteredMessages;

  const totalPages = Math.ceil(sortedMessages.length / messagesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedMessageId(null); // Close expanded message when changing page
  };

  const toggleMessageDetails = (messageId) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://192.168.1.8:8080/api/v1/contact-messages/${id}`, {
        withCredentials: true
      });
      if (response.data.success) {
        const updatedMessages = messages.filter(message => message.id !== id);
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }

  const renderPagination = () => {
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    const pages = [];

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return (
      <div className="flex justify-center mt-10 flex-wrap gap-2">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${page === currentPage
                ? 'bg-[#af0808] text-white'
                : 'bg-gray-100 hover:bg-gray-200'
              }`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto px-4 py-8 bg-white rounded-tl-xl">
      <div className="flex flex-col lg:gap-6">
        <div className='flex justify-center items-center py-10'>
          <div className="relative">
            <img className='absolute -bottom-2 -left-5 -rotate-90' src={ArrowLeft} alt="" />
            <h1 className="text-2xl font-bold text-[#0b2c3d] uppercase">Contact Messages</h1>
            <img className='absolute -top-2 -right-5 rotate-90' src={ArrowRight} alt="" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-10 lg:mt-20">
          <div className="flex items-center bg-white rounded-lg shadow-sm px-4 py-2 border border-gray-100 w-full md:w-auto">
            <span className="text-sm font-medium text-gray-600">Show</span>
            <select
              className="mx-3 px-4 py-1.5 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-[#af0808] focus:ring-1 focus:ring-[#af0808] bg-gray-50 cursor-pointer"
              value={selectedEntries}
              onChange={(e) => setSelectedEntries(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm font-medium text-gray-600">Entries</span>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-[40%] mt-4 md:mt-0">
            <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
            <input
              type="text"
              placeholder="Search by name"
              className="w-full px-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#af0808]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full lg:min-w-[800px] border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">DATE</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">NAME</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">EMAIL</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">PURPOSE</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {sortedMessages
              .slice(
                (currentPage - 1) * messagesPerPage,
                currentPage * messagesPerPage,
              )
              .map((message) => (
                <React.Fragment key={message.id}>
                  <tr className={`border-b transition-colors ${expandedMessageId === message.id ? 'bg-[#0b2c3d10] border-[#af0808]' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(message.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{message.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{message.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{message.purpose}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full transition-colors" onClick={() => toggleMessageDetails(message.id)}>
                          <img className='w-5' src={expandedMessageId === message.id ? EyeIcon : ClosedEyeIcon} alt="" />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={() => handleDelete(message.id)}>
                          <img className='w-5' src={DeleteIcon} alt="" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5" className="p-0">
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedMessageId === message.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-6 py-4 bg-[#0b2c3d05] border-l-4 border-[#af0808]">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xs lg:text-lg font-medium text-gray-700">Message:</h3>
                              <p className="text-sm lg:text-base text-gray-600">{message.message}</p>
                            </div>
                            <div>
                              <h3 className="text-xs lg:text-lg  font-medium text-gray-700">Phone:</h3>
                              <p className="text-sm lg:text-base text-gray-600">{message.mobileNumber}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default ContactMessages;
