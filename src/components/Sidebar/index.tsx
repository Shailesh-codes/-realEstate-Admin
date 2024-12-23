import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import companyLogo from '../../../public/assests/images/CompanyLogo.png';
import AddProperty from '../../../public/assests/AddProperty.svg';
import SVGComponent from '../../../public/assests/SVGComponents/DashBoardIcon';
import ColorableSvg from '../../hooks/ColorableSvg';
import ContactSVGComponent from '../../../public/assests/SVGComponents/ContactIcon';
import SettingSVGComponent from '../../../public/assests/SVGComponents/SettingIcon';
import LogoutIconSVGComponent from '../../../public/assests/SVGComponents/LogoutIcon';
import AddPropSVGComponent from '../../../public/assests/SVGComponents/AddPropertyIcon';
import UpdateSVGComponent from '../../../public/assests/SVGComponents/UpdateIcon';
import { MdClose } from 'react-icons/md';
import AddEmployeeIcon from '../../../public/assests/SVGComponents/AddEmployeeIcon';
import NotificationSVGComponent from '../../../public/assests/SVGComponents/NotificationSVGComponent';
import ResetPasswordSVGComponent from '../../../public/assests/SVGComponents/ResetPasswordSVGComponent';

type UserType = 'admin' | 'employee';

interface SidebarProps {
  sidebarOpen: boolean;
  userType: string;
  setIsModalOpen: (arg: boolean) => void;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  userType,
  setIsModalOpen,
}: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  // const [SidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // useEffect(() => {
  //   const keyHandler = ({ keyCode }: KeyboardEvent) => {
  //     if (!sidebarOpen || keyCode !== 27) return;
  //     setSidebarOpen(false);
  //   };
  //   document.addEventListener('keydown', keyHandler);
  //   return () => document.removeEventListener('keydown', keyHandler);
  // }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" />
      )}
      <aside
        ref={sidebar}
        className={`absolute left-0 top-0 z-[51] flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-4.5 ">
          <NavLink to="/">
            <div className="bg-white ml-12 rounded-md p-3 mt-10 lg:mt-0">
              <img src={companyLogo} alt="Logo" />
            </div>
          </NavLink>

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block"
          />
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear ">
          <nav className="flex flex-col gap-6  mt-5 py-4 px-4 lg:mt-0 lg:px-6">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 text-black lg:hidden"
            >
              <MdClose size={30} />
            </button>
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-[#af0808]">
                MENU
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <NavLink
                    to="/dashboard"
                    onClick={() => sidebarOpen && setSidebarOpen(false)}
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium border-[#0b2c3d] bg-[#e8ebed8a] hover:bg-[#0b2c3d25] text-[#64748b] hover:text-[#af0808] duration-300 ease-in-out ${
                      (pathname === '/dashboard' ||
                        pathname.includes('dashboard')) &&
                      'text-[#af0808]'
                    }`}
                  >
                    <div
                      className={`flex justify-between items-center w-full ${
                        pathname.includes('dashboard') && 'text-[#af0808]'
                      }`}
                    >
                      Dashboard
                      <ColorableSvg color="blue" width={24} height={24}>
                        <SVGComponent
                          color={pathname === '/dashboard' && '#af0808'}
                        />
                      </ColorableSvg>
                    </div>
                  </NavLink>
                </li>

                {userType === 'admin' && (
                  <li>
                    <NavLink
                      to="/contactpage"
                      onClick={() => sidebarOpen && setSidebarOpen(false)}
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 text-[#64748b] hover:text-[#af0808] px-4 font-medium bg-[#e8ebed8a] duration-300 ease-in-out hover:bg-graydark ${
                        pathname.includes('contactpage') && 'bg-graydark'
                      }`}
                    >
                      <div
                        className={`flex justify-between items-center w-full ${
                          pathname.includes('contactpage') && 'text-[#af0808]'
                        }`}
                      >
                        Contact Messages
                        <ColorableSvg color="blue" width={24} height={24}>
                          <ContactSVGComponent
                            color={pathname.includes('contactpage') && '#af0808'}
                          />
                        </ColorableSvg>
                      </div>
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink
                    to="/properties"
                    className={`group relative flex items-center gap-2.5 text-[#64748b] hover:text-[#af0808] rounded-sm py-2 px-4 font-medium bg-[#e8ebed8a] duration-300 ease-in-out hover:bg-graydark ${
                      pathname.includes('properties') && 'bg-graydark'
                    }`}
                  >
                    <div
                      className={`flex justify-between items-center w-full ${
                        pathname.includes('properties') && 'text-[#af0808]'
                      } `}
                    >
                      Add Property
                      <ColorableSvg color="blue" width={24} height={24}>
                        <AddPropSVGComponent
                          color={pathname.includes('properties') && '#af0808'}
                        />
                      </ColorableSvg>
                    </div>
                  </NavLink>
                </li>
                {userType === 'admin' && (
                  <li>
                    <NavLink
                      to="/updatecontent"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 text-[#64748b] hover:text-[#af0808] px-4 font-medium bg-[#e8ebed8a] duration-300 ease-in-out hover:bg-graydark ${
                        pathname.includes('updatecontent') &&
                        'bg-graydark text-[#af0808]'
                      }`}
                    >
                      <div
                        className={`flex justify-between items-center w-full ${
                          pathname.includes('updatecontent') && 'text-[#af0808]'
                        } `}
                      >
                        Update Content
                        <ColorableSvg color="blue" width={24} height={24}>
                          <UpdateSVGComponent
                            color={
                              pathname.includes('updatecontent') && '#af0808'
                            }
                          />
                        </ColorableSvg>
                      </div>
                    </NavLink>
                  </li>
                )}

                {userType === 'admin' && (
                  <li>
                    <NavLink
                      to="/addemployees"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium bg-[#e8ebed8a] duration-300 ease-in-out hover:bg-graydark text-[#64748b] ${
                        pathname.includes('addemployees') &&
                        'bg-graydark text-[#af0808]'
                      }`}
                    >
                      <div
                        className={`flex justify-between items-center w-full ${
                          pathname.includes('addemployees') && 'text-[#af0808]'
                        }`}
                      >
                        Add Employees
                        <ColorableSvg color="blue" width={24} height={24}>
                          <AddEmployeeIcon
                            color={pathname.includes('addemployees') && '#af0808'}
                          />
                        </ColorableSvg>
                      </div>
                    </NavLink>
                  </li>
                )}

                {userType === 'admin' && (
                  <li>
                    <NavLink
                      to="/notifications"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 text-[#64748b] hover:text-[#af0808] px-4 font-medium bg-[#e8ebed8a] duration-300 ease-in-out hover:bg-graydark ${
                        pathname.includes('notifications') &&
                        'bg-graydark text-[#af0808]'
                      }`}
                    >
                      <div
                        className={`flex justify-between items-center w-full ${
                          pathname.includes('notifications') && 'text-[#af0808]'
                        } `}
                      >
                        Notifications
                        <ColorableSvg color="blue" width={24} height={24}>
                          <NotificationSVGComponent
                            color={
                              pathname.includes('notifications') && '#af0808'
                            }
                          />
                        </ColorableSvg>
                      </div>
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="mb-4 ml-4 text-sm font-semibold text-[#af0808]">
                OTHERS
              </h3>

              {userType === 'employee' && (
                <NavLink
                  to="/settings"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium bg-[#e8ebed8a] text-[#0b2c3d] duration-300 ease-in-out hover:bg-graydark ${
                    pathname.includes('settings') && 'bg-graydark text-[#af0808]'
                  }`}
                >
                  <div className="flex justify-between items-center w-full hover:text-[#af0808]">
                    Account Settings
                    <ColorableSvg color="blue" width={24} height={24}>
                      <SettingSVGComponent
                        color={pathname.includes('settings') && '#af0808'}
                      />
                    </ColorableSvg>
                  </div>
                </NavLink>
              )}

              <div
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className="flex px-4 text-[#0b2c3d] bg-[#e8ebed8a] py-2 font-medium justify-between items-center w-full"
              >
                Logout
                <ColorableSvg color="blue" width={24} height={24}>
                  <LogoutIconSVGComponent color={''} />
                </ColorableSvg>
              </div>
              <div>
                {' '}
                <NavLink
                  to="/resetpassword"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 text-[#64748b] hover:text-[#af0808] px-4 font-medium bg-[#e8ebed8a] duration-300 ease-in-out hover:bg-graydark ${
                    pathname.includes('resetpassword') &&
                    'bg-graydark text-[#af0808]'
                  }`}
                >
                  <div
                    className={`flex justify-between items-center w-full ${
                      pathname.includes('resetpassword') && 'text-[#af0808]'
                    } `}
                  >
                    Reset Password
                    <ColorableSvg color="blue" width={24} height={24}>
                      <ResetPasswordSVGComponent
                        color={pathname.includes('') && '#af0808'}
                      />
                    </ColorableSvg>
                  </div>
                </NavLink>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
