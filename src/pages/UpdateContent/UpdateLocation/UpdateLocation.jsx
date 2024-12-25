import React, { useEffect, useState } from 'react'
import api from '../../../hooks/useApi'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function UpdateLocation() {

  const [inputValue, setInputValue] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`${api}/update-section/location`);
        if (response.ok) {
          const data = await response.json();
          
          setMapUrl(data.mapUrl || '');
          setAddress(data.address || '');
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };
    
    fetchLocation();
  }, []);

  const handleSubmit = async () => {
    try {
      // Validate inputs
      if (!mapUrl || !address) {
        toast.error('Please provide both map URL and address');
        return;
      }

      const response = await fetch(`${api}/update-section/update-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mapUrl: mapUrl,
          address: address
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Location updated successfully!');
        // Update with the returned data
        setMapUrl(data.location.mapUrl);
        setAddress(data.location.address);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update location');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error(error.message || 'Failed to update location');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className='px-4 sm:px-7 py-8 bg-white rounded-tl-xl flex flex-col items-center gap-4'>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-medium uppercase text-center">Location On Map</h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 justify-evenly py-6 lg:py-10">
            <div className="border h-[400px] w-full lg:w-[50%] p-4 lg:p-6 flex items-center justify-center rounded-md flex-col gap-6">
              
              <input 
                value={mapUrl}
                onChange={(e)=> setMapUrl(e.target.value)} 
                className='placeholder:text-sm text-sm text-black outline-[#af0808] border w-full p-3 lg:p-4' 
                type="text" 
                placeholder="Paste Google Maps embed URL here..." 
              />
              <div className="flex flex-col gap-4 w-full">
                <h3 className="text-base lg:text-lg font-medium">How to get Google Maps Embed Link:</h3>
                <ol className="text-sm lg:text-base list-decimal ml-6 space-y-2">
                  <li>Go to Google Maps</li>
                  <li>Search for your location</li>
                  <li>Click on "Share" button</li>
                  <li>Select "Embed a map"</li>
                  <li>Copy the provided iframe src URL</li>
                  <li>Paste the URL below</li>
                </ol>
              </div>
            </div>
            <div className="border h-[300px] lg:h-[400px] w-full lg:w-[40%]">
              <iframe className='border-0 w-full h-full' src={mapUrl} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
        <hr className='my-8 lg:my-14 w-[60%] lg:w-[40%] border-[#ebc2c2]' />
        <div className="flex flex-col gap-5 lg:gap-7 w-full">
          <div className="flex items-center justify-center">
            <h2 className="text-xl font-medium uppercase text-center">Address</h2>
          </div>
          <div className="flex items-center justify-center px-4">
            <textarea 
              className='border w-full lg:w-[80%] p-3 lg:p-4 outline-[#af0808]' 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder='updated address...'
            />
          </div>
          <div className="flex items-center justify-center">
            <button 
              onClick={handleSubmit}
              className='border border-[#0b2c3d] bg-[#0b2c3d] hover:bg-[#0b2c3d18] text-[white] rounded-sm hover:text-[#0b2c3d] transition-colors py-2 lg:py-3 px-6 lg:px-10 text-sm'
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateLocation
