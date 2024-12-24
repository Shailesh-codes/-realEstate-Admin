import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddImage from '../../../../public/assests/AddImage.svg';
import DeleteIcon from '../../../../public/assests/DeleteIcon.svg';
import UpdateIcon from '../../../../public/assests/UpdateIcon.svg';
import AddCarousel from '../../../../public/assests/AddCarousel.svg';
// import AreaIcon from '../../../../public/assests/areaWhite.svg';
import area from '../../../../public/assests/images/areahm.svg';
import { IoIosBed } from 'react-icons/io';
import { FaKitchenSet } from 'react-icons/fa6';
import { FaBath } from 'react-icons/fa';
import '../../../../public/Styles/Global.css';
import EditCarouselModel from '../EditCarouselModel';
import api from '../../../hooks/useApi';
import DeletePopup from '../../../Authentication/deletePopUp';

function UpdateHeroSection() {
  const [EditModel, setEditModel] = useState(false);
  const [selectedCarousel, setSelectedCarousel] = useState(0);

  const [carousels, setCarousels] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [carouselToDelete, setCarouselToDelete] = useState(null);

  useEffect(() => {
    fetchCarousels();
  }, []);

  const fetchCarousels = async () => {
    try {
      const response = await axios.get(
        `${api}/hero-carousel/carousels`,
      );
      const formattedData = response.data.map((carousel) => ({
        ...carousel,
        url: carousel.image.startsWith('data:image') 
          ? carousel.image 
          : `data:image/jpeg;base64,${carousel.image}`,
      }));
      setCarousels(formattedData);
    } catch (error) {
      console.error('Error fetching carousels:', error);
    }
  };

  async function handleCarouselAdd() {
    if (carousels.length < 10) {
      try {
        const formData = new FormData();
        formData.append('title', '');
        formData.append('propertyName', '');
        formData.append('address', '');
        formData.append('price', '');
        formData.append('area', '');
        formData.append('room', '');
        formData.append('bath', '');
        formData.append('kitchen', '');

        const response = await fetch('/assests/default-property.jpg');
        const blob = await response.blob();
        formData.append('image', blob);

        const result = await axios.post(
          `${api}/hero-carousel/carousels`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (result.status === 201) {
          await fetchCarousels();
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      } catch (error) {
        console.error('Error adding carousel:', error);
      }
    }
  }

  async function HandleDeleteClick(e, index) {
    setCarouselToDelete(index);
    setShowDeletePopup(true);
  }

  const handleConfirmDelete = async () => {
    try {
      const carouselId = carousels[carouselToDelete].id;
      const response = await axios.delete(
        `${api}/hero-carousel/carousels/${carouselId}`,
      );

      if (response.status === 200) {
        setCarousels((preVal) => preVal.filter((_, i) => i !== carouselToDelete));
      }
    } catch (error) {
      console.error('Error deleting carousel:', error);
    } finally {
      setShowDeletePopup(false);
      setCarouselToDelete(null);
    }
  };

  async function handleImageChange(e, index) {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const carouselId = carousels[index].id;
        const response = await axios.put(
          `${api}/hero-carousel/carousels/${carouselId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (response.status === 200) {
          const reader = new FileReader();
          reader.onload = () => {
            setCarousels((preVal) => {
              const newArray = [...preVal];
              newArray[index] = {
                ...newArray[index],
                url: reader.result,
              };
              return newArray;
            });
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error('Error updating image:', error);
      }
    }
  }

  async function handleEditClick(e, index) {
    setEditModel(true);
    setSelectedCarousel(index);
  }

  const handleCarouselUpdate = async (updatedData) => {
    try {
      const carouselId = carousels[selectedCarousel].id;
      const response = await axios.put(
        `${api}/hero-carousel/carousels/${carouselId}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        await fetchCarousels();
        setEditModel(false);
      }
    } catch (error) {
      console.error('Error updating carousel:', error);
    }
  };

  return (
    <div className="px-4 md:px-7 py-8 bg-white rounded-tl-xl flex gap-4">
      <div className="flex w-full relative flex-col md:flex-row">
        <div className="w-full md:w-2/3 py-4 flex flex-col-reverse items-center justify-center gap-7">
          {carousels.map((carousel, index) => (
            <div className="popUpAnimation flex flex-col md:flex-row w-full">
              <div
                className="relative w-full md:w-[90%] h-80"
                style={{
                  backgroundImage: `url(${carousel.url})`,
                  backgroundSize: 'cover',
                }}
              >
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-[#0000008f] p-3 md:p-4 lg:p-8">
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-white text-xs md:text-sm">{carousel.title}</h3>

                      <div className="flex flex-col gap-1">
                        <h1 className="text-white text-xl md:text-3xl font-normal leading-tight">
                          {carousel.propertyName}
                        </h1>
                        <p className="text-white text-xs md:text-sm lg:text-base">
                          {carousel.address}
                        </p>
                      </div>

                      <div className="">
                        <span className="text-white text-lg md:text-xl font-medium bg-[#00000065] border-b-2 px-2 md:px-3 py-1 md:py-2 inline-block">
                          Price: ${carousel.price}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-4 lg:mt-6">
                      <div className="flex flex-col items-center">
                        <img src={area} alt="" />
                        <span className="text-white text-xs md:text-sm lg:text-base">
                          {carousel.area}
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <IoIosBed size={25} className='text-white' />
                        <span className="text-white text-xs md:text-sm lg:text-base">
                          {carousel.room}
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <FaBath size={23} className="text-white" />
                        <span className="text-white text-xs md:text-sm lg:text-base">
                          {carousel.bath}
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <FaKitchenSet size={23} className="text-white" />
                        <span className="text-white text-xs md:text-sm lg:text-base">
                          {carousel.kitchen}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[10%] flex flex-row md:flex-col justify-between h-16 md:h-80 border">
                <div className="flex md:block">
                  <div
                    onClick={(e) => handleEditClick(e, index)}
                    className="group relative cursor-pointer border w-full h-14 flex items-center justify-center"
                  >
                    <img className="p-1 lg:w-8" src={UpdateIcon} alt="" />
                    <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -left-20 z-50">
                      Edit Property
                    </span>
                  </div>

                  <div className="group relative cursor-pointer border w-full h-14 flex items-center justify-center">
                    <input
                      onChange={(e) => handleImageChange(e, index)}
                      className="cursor-pointer h-full w-full absolute opacity-0"
                      type="file"
                    />
                    <img className="p-1 lg:w-8" src={AddImage} alt="" />
                    <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -left-20 z-50">
                      Change Image
                    </span>
                  </div>
                </div>
                <div className="flex md:block">
                  <div
                    onClick={(e) => HandleDeleteClick(e, index)}
                    className="group relative cursor-pointer border w-full h-14 flex items-center justify-center"
                  >
                    <img className="p-1 lg:w-8" src={DeleteIcon} alt="" />
                    <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -left-20 z-50">
                      Delete Property
                    </span>
                  </div>
                  <div className="cursor-default border p-2 lg:p-0 lg:w-full h-14 flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="sticky top-20 right-0 w-full md:w-1/3 h-50 flex items-center justify-center py-4 md:py-0">
          <div
            onClick={handleCarouselAdd}
            className="group relative border w-32 h-32 rounded-full flex items-center justify-center cursor-pointer"
          >
            <img src={AddCarousel} alt="" />
            <span className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -bottom-8 z-50">
              Add New Property
            </span>
          </div>
        </div>
      </div>
      {EditModel && (
        <EditCarouselModel
          EditModel={EditModel}
          setEditModel={setEditModel}
          selectedCarousel={selectedCarousel}
          carouselData={carousels[selectedCarousel]}
          onUpdate={handleCarouselUpdate}
        />
      )}
      <DeletePopup
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onDelete={handleConfirmDelete}
        itemName="property"
      />
    </div>
  );
}

export default UpdateHeroSection;
