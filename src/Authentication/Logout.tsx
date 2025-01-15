import React from 'react';
import LogoutIconSVGComponent from '../../public/assests/SVGComponents/LogoutIcon';
import ColorableSvg from '../hooks/ColorableSvg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LogoutProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
}

const Logout: React.FC<LogoutProps> = ({ setIsModalOpen }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    async function HandleLogoutFunction() {
        try {
            await logout();
            toast.success('Logged out successfully', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // Add a small delay before closing modal and navigating
            setTimeout(() => {
                setIsModalOpen(false);
                navigate('/', { replace: true });
            }, 1000);
        } catch (error) {
            toast.error('Failed to logout. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    function CancelClick() {
        setIsModalOpen(false);
    }

    return (
        <>
            <div className="fixed flex items-center justify-center top-0 right-0 bottom-0 left-0 bg-[#00000077] z-9999">
                <div className="w-80 p-6 bg-white rounded-3xl shadow-lg">
                    <div className="flex flex-col items-center">
                        <div className="p-4 mb-4 rounded-full bg-[#f4eded]">
                            <ColorableSvg>
                                <LogoutIconSVGComponent />
                            </ColorableSvg>
                        </div>

                        <h2 className={`mb-2 text-2xl font-bold text-black`}>Log Out</h2>
                        <p className="mb-6 text-sm text-center text-black capitalize">
                            Are You Sure you want to log out?
                        </p>
                        <div className="flex justify-center space-x-4 w-full">
                            <button
                                onClick={CancelClick}
                                className="px-4 py-2 text-sm font-bold text-[#dc2626] rounded-md hover:bg-[#f4eded]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={HandleLogoutFunction}
                                className="px-4 py-2 text-sm font-bold text-white bg-[#ce2626e9] rounded-md hover:bg-[#dc2626]"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Logout;
