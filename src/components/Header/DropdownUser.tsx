import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import Arrow from '../../../public/assests/ArrowDown.svg'
import ContactIcon from '../../../public/assests/SVGComponents/ContactIcon'
import DashboardIcon from '../../../public/assests/SVGComponents/DashBoardIcon'
import ColorableSvg from '../../hooks/ColorableSvg';
import SettingSVGComponent from '../../../public/assests/SVGComponents/SettingIcon';
import LogoutIconSVGComponent from '../../../public/assests/SVGComponents/LogoutIcon';
import AddPropSVGComponent from '../../../public/assests/SVGComponents/AddPropertyIcon';
import Logout from '../../Authentication/Logout';
import { useAuth } from '../../context/AuthContext';
import api from "../../hooks/useApi";


const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const location = useLocation();
  const { pathname } = location;
  const { user } = useAuth();
 

  const getProfilePhotoUrl = async (employeeId: string) => {
    try {
      const response = await fetch(`${api}/employee-info/${employeeId}/photo`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch photo');
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching profile photo:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (user?.id) {
        const photoUrl = await getProfilePhotoUrl(user.id);
        if (photoUrl) {
          setProfilePhotoUrl(photoUrl);
        }
      }
    };

    fetchProfilePhoto();

    return () => {
      if (profilePhotoUrl) {
        URL.revokeObjectURL(profilePhotoUrl);
      }
    };
  }, [user?.id]);

  const defaultAvatar = 'https://avatar.iran.liara.run/public/boy';

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {user?.name || 'User'}
          </span>
          <span className="block text-xs capitalize">
            {user?.role || 'Guest'}
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img 
            src={profilePhotoUrl || user?.profilePhoto || defaultAvatar} 
            alt="User"
            className="h-full w-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />
        </span>

        <img 
          className={`${dropdownOpen ? 'rotate-180' : ''} transition-all duration-500 ease-in-out`} 
          src={Arrow} 
          alt="" 
        />
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        className={`absolute right-10 mt-4 flex flex-col border border-stroke bg-white rounded-xl dark:border-strokedark dark:bg-boxdark overflow-hidden transition-all duration-500 ease-in-out shadow-lg ${dropdownOpen ? 'h-60  w-67 ' : 'h-0  w-0 '}`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-[#af0808] lg:text-base"
            >
              <ColorableSvg color="blue" width={24} height={24}>
                <DashboardIcon color={pathname === ('/dashboard') && '#af0808'} />
              </ColorableSvg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/contactpage"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-[#af0808] lg:text-base"
            >
              <ColorableSvg color="blue" width={24} height={24}>
                <ContactIcon color={pathname === ('/contactpage') && '#af0808'} />
              </ColorableSvg>
              Contact Messages
            </Link>
          </li>
          {user?.role === 'employee' && (
            <li>
              <Link
                to="/settings"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-[#af0808] lg:text-base"
              >
                <ColorableSvg color="blue" width={24} height={24}>
                  <SettingSVGComponent color={pathname.includes('settings') && '#af0808'} />
                </ColorableSvg>
                Account Settings
              </Link>
            </li>
          )}
          {user?.role === 'admin' && (
            <li>
              <Link
                to="/properties"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-[#af0808] lg:text-base"
              >
                <ColorableSvg color="blue" width={24} height={24}>
                  <AddPropSVGComponent color={pathname.includes('properties') && '#af0808'} />
                </ColorableSvg>
                Add Property
              </Link>
            </li>
          )}
        </ul>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-[#af0808] lg:text-base"
        >
          <ColorableSvg color="#64748b" width={24} height={24}>
            <LogoutIconSVGComponent />
          </ColorableSvg>
          Log Out
        </button>
      </div>

      {/* Render Logout modal conditionally */}
      {isModalOpen && <Logout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
    </ClickOutside>
  );
};

export default DropdownUser;
