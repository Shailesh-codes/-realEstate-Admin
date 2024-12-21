import React from 'react'
import Location from '../../../public/assests/LocationIcon.svg'
import aboutIcon from "../../../public/assests/aboutIcon.svg"
import homeIcon from "../../../public/assests/HomeIcon.svg"
import { useNavigate } from 'react-router-dom'

function UpdateContent() {

    const navigate = useNavigate();

    return (
        <div className='lg:px-7 py-8 rounded-tl-xl flex flex-col md:flex-row gap-4'>

            <div onClick={()=>navigate('/updatelocation')} className="group relative w-full md:w-[30%] h-32 bg-white rounded-xl border border-[#efcdcd] shadow-md overflow-hidden cursor-pointer">
                {/* Icon Container */}
                <div className="absolute top-0 w-24 h-14 bg-gray-100/50 
                    transform transition-all duration-500 ease-in-out
                    right-0 group-hover:right-[calc(100%-6rem)]
                    flex items-center justify-center
                    rounded-tr-none rounded-tl-none group-hover:rounded-tr-full group-hover:rounded-tl-none rounded-full">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                       <img src={Location} alt="" />
                    </div>
                </div>

                {/* Text Container */}
                <div className="absolute bottom-0 w-[83%] 
                    transform transition-all duration-500 ease-in-out
                    left-0 group-hover:left-[calc(100%-83%)]
                    flex items-center justify-center
                    rounded-bl-none rounded-br-none group-hover:rounded-bl-full group-hover:rounded-br-none rounded-full
                    border p-4">
                    <h2 className="text-lg font-medium text-gray-900">Update Location</h2>
                </div>
            </div>

            <div onClick={()=>navigate('/updateaboutuspage')} className="group relative w-full md:w-[30%] h-32 bg-white rounded-xl border border-[#efcdcd] shadow-md overflow-hidden cursor-pointer">
                {/* Icon Container */}
                <div className="absolute top-0 w-24 h-14 bg-gray-100/50 
                    transform transition-all duration-500 ease-in-out
                    right-0 group-hover:right-[calc(100%-6rem)]
                    flex items-center justify-center
                    rounded-tr-none rounded-tl-none group-hover:rounded-tr-full group-hover:rounded-tl-none rounded-full">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                       <img src={aboutIcon} alt="" />
                    </div>
                </div>

                {/* Text Container */}
                <div className="absolute bottom-0 w-[83%] 
                    transform transition-all duration-500 ease-in-out
                    left-0 group-hover:left-[calc(100%-83%)]
                    flex items-center justify-center
                    rounded-bl-none rounded-br-none group-hover:rounded-bl-full group-hover:rounded-br-none rounded-full
                    border p-4">
                    <h2 className="text-lg font-medium text-gray-900">Update AboutUs Page</h2>
                </div>
            </div>

            <div onClick={()=>navigate('/updateherosectioncarousel')} className="group relative w-full md:w-[40%] h-32 bg-white rounded-xl border border-[#efcdcd] shadow-md overflow-hidden cursor-pointer">
                {/* Icon Container */}
                <div className="absolute top-0 w-24 h-14 bg-gray-100/50 
                    transform transition-all duration-500 ease-in-out
                    right-0 group-hover:right-[calc(100%-6rem)]
                    flex items-center justify-center
                    rounded-tr-none rounded-tl-none group-hover:rounded-tr-full group-hover:rounded-tl-none rounded-full">
                    <div className="w-6 h-7 rounded-full flex items-center justify-center">
                       <img src={homeIcon} alt="" />
                    </div>
                </div>

                {/* Text Container */}
                <div className="absolute bottom-0 w-[83%] 
                    transform transition-all duration-500 ease-in-out
                    left-0 group-hover:left-[calc(100%-83%)]
                    flex items-center justify-center
                    rounded-bl-none rounded-br-none group-hover:rounded-bl-full group-hover:rounded-br-none rounded-full
                    border p-4">
                    <h2 className="text-lg font-medium text-gray-900">Update Hero Section Carousel</h2>
                </div>
            </div>
        </div>
    )
}

export default UpdateContent
