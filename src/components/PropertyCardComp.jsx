import React from 'react'
import { useLocation } from 'react-router-dom'
import areaIcon from '../../public/assests/area.svg'
import BedRoom from '../../public/assests/BedIcon.svg'
import bathroom from '../../public/assests/Bathroom.svg'
import GarageIcon from '../../public/assests/GarageIcon.svg'
import eyeOpen from '../../public/assests/EyeOpenIcon.svg'

function PropertyCardComp({ viewMode, ...props }) {


  const location = useLocation();

  const { pathname } = location;


  return (
    <div className={`${
      viewMode === 'grid' 
      ? 'w-full' // Full width in grid mode
      : 'w-full max-w-4xl mx-auto' // Centered with max width in list mode
    } bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 relative`}>
      <div className="absolute top-3 left-4 z-10">
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => props.onSelect(props.id)}
          className="h-5 w-5 cursor-pointer accent-[#af0808]"
        />
      </div>
      <div className="h-[230px] relative">
        <img 
          src={props.img} 
          alt={props.name}
          className="w-full h-full object-cover rounded-t-xl"
        />
        <div className="absolute bottom-2 left-2 bg-white rounded-xl rounded-bl-sm px-3">
          <span className='text-sm'>{props.For}</span>
        </div>
        <div className="absolute top-2 right-2 bg-white rounded-sm rounded-tr-xl px-2 py-1">
          <span className='text-sm'>₹ {props.Price}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <h4 className='text-xl'>{props.name}</h4>

        <p className='text-[13px] text-[#494949]'>Al Wasl Road
          Villa 42, Street 11B
          Jumeirah 2
          Dubai, United Arab Emirates
          P.O. Box 38234</p>
        <p className='text-sm text-[#494949]'>Added : 08 November, 2024</p>

        <hr className=' border-[#af08083f]' />
        <div className="flex justify-between px-2">
          <div className="flex gap-1"><img className='w-4' src={areaIcon} alt="" /> <span className='text-xs text-[#494949]'>{props.area}sq.fit</span></div>
          <div className="flex gap-1"><img className='w-4' src={BedRoom} alt="" /><span className='text-xs text-[#494949]'>{props.bedrooms}</span></div>
          <div className="flex gap-1"><img className='w-4' src={bathroom} alt="" /><span className='text-xs text-[#494949]'>{props.bathrooms}</span></div>
          <div className="flex gap-1"><img className='w-4' src={GarageIcon} alt="" /><span className='text-xs text-[#494949]'>{props.Garage}</span></div>
        </div>
        <hr className=' border-[#af08083f]' />

      </div>
    </div>
  )
}

export default PropertyCardComp
