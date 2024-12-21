import React from 'react';
import { Link } from 'react-router-dom';
import ArrowLeft from "../../../../public/assests/ArrowLeft.svg"

const Notifications = () => {
  return (
    <div className="container flex flex-col mx-auto max-w-4xl px-4 py-8 gap-10">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="relative inline-block">
            <img
              className="absolute left-4 top-7 -translate-y-1/2 -rotate-90 w-8 h-8 md:w-10 md:h-10"
              src={ArrowLeft}
              alt="decorative arrow"
            />
            <h1 className="text-2xl md:text-2xl font-bold text-[#0b2c3d] uppercase px-12">
              Notifications
            </h1>
            <img
              className="absolute right-4 top-2 -translate-y-1/2 rotate-90 w-8 h-8 md:w-10 md:h-10"
              src={ArrowLeft}
              alt="decorative arrow"
            />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm">
        <ul className="divide-y divide-gray-200">
          <li>
            <Link
              className="block transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 md:px-8 py-6"
              to="#"
            >
              <div className="flex flex-col gap-2">
                <p className="text-base md:text-lg">
                  <span className="font-semibold text-black dark:text-white">
                    Edit your information in a swipe
                  </span>{' '}
                  <span className="text-gray-600 dark:text-gray-300">
                    Sint occaecat cupidatat non proident, sunt in culpa qui
                    officia deserunt mollit anim.
                  </span>
                </p>
                <p className="text-sm text-gray-500">12 May, 2025</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="block transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 md:px-8 py-6"
              to="#"
            >
              <div className="flex flex-col gap-2">
                <p className="text-base md:text-lg">
                  <span className="font-semibold text-black dark:text-white">
                    It is a long established fact
                  </span>{' '}
                  <span className="text-gray-600 dark:text-gray-300">
                    that a reader will be distracted by the readable.
                  </span>
                </p>
                <p className="text-sm text-gray-500">24 Feb, 2025</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="block transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 md:px-8 py-6"
              to="#"
            >
              <div className="flex flex-col gap-2">
                <p className="text-base md:text-lg">
                  <span className="font-semibold text-black dark:text-white">
                    There are many variations
                  </span>{' '}
                  <span className="text-gray-600 dark:text-gray-300">
                    of passages of Lorem Ipsum available, but the majority have
                    suffered
                  </span>
                </p>
                <p className="text-sm text-gray-500">04 Jan, 2025</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="block transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 md:px-8 py-6"
              to="#"
            >
              <div className="flex flex-col gap-2">
                <p className="text-base md:text-lg">
                  <span className="font-semibold text-black dark:text-white">
                    There are many variations
                  </span>{' '}
                  <span className="text-gray-600 dark:text-gray-300">
                    of passages of Lorem Ipsum available, but the majority have
                    suffered
                  </span>
                </p>
                <p className="text-sm text-gray-500">01 Dec, 2024</p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
