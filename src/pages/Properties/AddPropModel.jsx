import React, { useState } from 'react';
import axios from 'axios';
import CrossIcon from '../../../public/assests/CrossIcon.svg';
import AddCloudIcon from '../../../public/assests/AddCloudIcon.svg';
import AddImage from '../../../public/assests/AddImage.svg';
import api from '../../hooks/useApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddPropModel({ modelOpen, setModelOpen }) {
  if (!modelOpen) {
    return;
  }

  const [Imgs, setImg] = useState([
    {
      id: 1,
      img: '',
      preview: '',
    },
  ]);

  const [title, setTitle] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [garage, setGarage] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [propertyFor, setPropertyFor] = useState('');
  const [price, setPrice] = useState('');

  function HandleAddImageClick() {
    if (Imgs.length < 7) {
      setImg((PreVal) => {
        let newArray = [...PreVal];
        let newArray2 = [...newArray, { id: newArray.length + 1, img: '' }];
        return newArray2;
      });
    }
  }

  function handleImageChange(e, index) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg((preVal) => {
          let NewArray = [...preVal];
          NewArray[index] = {
            ...NewArray[index],
            img: file,
            preview: reader.result,
          };
          return NewArray;
        });
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async () => {
    try {
      // Validation checks
      if (
        !title ||
        !bedrooms ||
        !bathrooms ||
        !garage ||
        !address ||
        !area ||
        !propertyFor ||
        !price
      ) {
        toast.error('Please fill in all fields');
        return;
      }

      if (!Imgs[0].img) {
        toast.error('Please add at least one image');
        return;
      }

      const formData = new FormData();

      // Convert numeric values to numbers
      formData.append('name', title);
      formData.append('bedrooms', Number(bedrooms));
      formData.append('bathrooms', Number(bathrooms));
      formData.append('garage', Number(garage));
      formData.append('address', address);
      formData.append('area', Number(area));
      formData.append('propertyFor', propertyFor);
      formData.append('price', Number(price));

      // Add only valid images
      Imgs.forEach((imgData) => {
        if (imgData.img instanceof File) {
          // Check if it's actually a File object
          formData.append('images', imgData.img);
        }
      });

      const response = await axios.post(`${api}/properties`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success('Property added successfully!');
        setModelOpen(false);
        // Optional: Clear form fields here if needed
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add property');
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="AddProductModel fixed z-9999 flex items-center justify-center top-0 right-0 bottom-0 left-0 bg-[#000000b1] py-4 px-4">
        <div className="h-full relative rounded-sm bg-white p-6 overflow-y-auto">
          <img
            onClick={() => setModelOpen(false)}
            className="absolute cursor-pointer top-2 right-2"
            src={CrossIcon}
            alt=""
          />
          <button
            onClick={handleSubmit}
            className="absolute bottom-2 right-2 border border-[#0b2c3d] bg-[#0b2c3d] hover:bg-[#0b2c3d18] text-[white] rounded-sm hover:text-[#0b2c3d] transition-colors py-3 px-4 rounded-br-lg text-sm"
          >
            Add Property
          </button>

          <div className="mt-10 flex flex-col gap-4">
            <div className="w-full py-2 flex flex-col md:flex-row items-center px-4 gap-4">
              <div className="flex flex-wrap gap-4">
                {Imgs.map((item, index) => (
                  <div className="w-32 h-32 hover:scale-105 transition-all duration-300 ease-in-out border rounded-lg flex items-center justify-center relative">
                    {item.preview ? (
                      <img
                        src={item.preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <img src={AddCloudIcon} alt="Upload" />
                    )}
                    <input
                      type="file"
                      onChange={(e) => handleImageChange(e, index)}
                      className="w-full h-full opacity-0  cursor-pointer absolute"
                    />
                  </div>
                ))}
              </div>
              <div
                onClick={() => {
                  HandleAddImageClick();
                }}
                className="w-25 hover:scale-105 transition-all duration-300 ease-in-out rounded-full cursor-pointer h-25 border flex items-center justify-center"
              >
                <img src={AddImage} alt="" />
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="title"
                className="rounded-md outline-[#af0808] border-[#af080834] text-black border px-4 py-2 w-full"
              />
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="rounded-md outline-[#af0808] border-[#af080834] text-black border py-2 px-2 w-full"
                placeholder="bedrooms..."
              />
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="rounded-md outline-[#af0808] border-[#af080834] text-black border py-2 px-2 w-full"
                placeholder="bathrooms..."
              />
              <input
                type="number"
                value={garage}
                onChange={(e) => setGarage(e.target.value)}
                className="rounded-md outline-[#af0808] border-[#af080834] text-black border py-2 px-2 w-full"
                placeholder="garage..."
              />
            </div>
            <div className="">
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-md outline-[#af0808] border-[#af080834] text-black border w-full px-4 py-2"
                placeholder="address...."
              ></textarea>
            </div>
            <div className="flex gap-4">
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="rounded-md outline-[#af0808] border-[#af080834] text-black border py-2 px-2 w-full"
                placeholder="area..."
              />
              <div className="w-full">
                <select
                  value={propertyFor}
                  onChange={(e) => setPropertyFor(e.target.value)}
                  className="rounded-md outline-[#af0808] appearance-none w-full border-[#af080834] text-black border py-2 px-7"
                  name=""
                  id=""
                >
                  <option value="">For</option>
                  <option value="buy">Buy</option>
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              </div>
              <div className="w-full">
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="rounded-md w-full outline-[#af0808] border-[#af080834] text-black border px-2 py-2"
                  placeholder="price..."
                />
              </div>
              {/* <input type="number" className='border py-2 px-2 w-full' placeholder='bedrooms...'  />
            <input type="number" className='border py-2 px-2 w-full' placeholder='bathrooms...'  />
            <input type="number" className='border py-2 px-2 w-full' placeholder='garage...'  /> */}
            </div>
            <div className="flex gap-4">
              {/* <div className="">
              <select className='border py-2 px-7' name="" id="">
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </div>
            <div className="">
              <input type="text" className='border px-2 py-2' placeholder='price...' />
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddPropModel;
