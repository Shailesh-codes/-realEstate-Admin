import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddCloudIcon from '../../../../public/assests/AddCloudIcon.svg';
import AddImage from '../../../../public/assests/AddImage.svg';
import api from '../../../hooks/useApi';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function UpdateAboutUsPage() {
  const [about, setAbout] = useState(
    'We Provide Right Choice of Properties that You need and have great opportunity to choose from thousands of Collection',
  );

  const [Imgs, setImg] = useState([
    {
      id: 1,
      img: '',
      preview: '',
    },
  ]);

  function HandleAddImageClick() {
    if (Imgs.length < 5) {
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

  const handleUpdateAbout = async () => {
    try {
      const formData = new FormData();
      formData.append('description', about);
      
      // Append only valid images
      Imgs.forEach((img, index) => {
        if (img.img) {
          formData.append(`images`, img.img);
        }
      });

      const response = await axios.put(`${api}/about/update`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.success) {
        toast.success('About page updated successfully');
      }
    } catch (error) {
      console.error('Error updating about page:', error);
      toast.error('Failed to update about page');
    }
  };

  const [aboutData, setAboutData] = useState({});

  
  useEffect(()=>{
    const  aboutContent = async () =>{
      const response = await fetch(' http://192.168.1.8:8080/api/v1/about');
      const data = await response.json();
      console.log(data.data);   
      setAboutData(data.data);   
    }
    aboutContent();
  }, [])


  useEffect(()=>{
    if(aboutData.about){
      setAbout(aboutData.about.description)
    }
  }, [aboutData])

  return (
    <>
    <ToastContainer/>
    <div className="px-4 lg:px-7 py-4 lg:py-8 bg-white rounded-tl-xl flex flex-col items-center justify-center gap-4 lg:gap-7">
      <div className="w-full">
        <div className="flex justify-center items-center py-5 lg:py-10">
          <div className="relative">
            <h1 className="text-xl lg:text-2xl font-bold text-[#0b2c3d] uppercase">
              About
            </h1>
          </div>
        </div>
        <textarea
          onChange={(e) => {
            setAbout(e.target.value);
          }}
          className="w-full min-h-[120px] lg:h-24 p-4 outline-[#af0808] text-black border text-sm lg:text-base"
          type="text"
          placeholder="Enter the content to update"
          value={about}
        />
      </div>
      
      <hr className="my-8 lg:my-14 w-[60%] lg:w-[40%] border-[#ebc2c2]" />
      
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-center items-center py-5 lg:py-10">
          <div className="relative">
            <h1 className="text-xl lg:text-2xl font-bold text-[#0b2c3d] uppercase">
              Our Partners
            </h1>
          </div>
        </div>

        <div className="w-full py-2 flex flex-col md:flex-row items-center justify-center px-2 lg:px-4 gap-4">
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
            {Imgs.map((item, index) => (
              <div className="w-24 h-24 lg:w-32 lg:h-32 hover:scale-105 transition-all duration-300 ease-in-out border rounded-lg flex items-center justify-center relative">
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
            onClick={HandleAddImageClick}
            className="w-20 h-20 lg:w-25 lg:h-25 hover:scale-105 transition-all duration-300 ease-in-out rounded-full cursor-pointer border flex items-center justify-center"
          >
            <img src={AddImage} alt="" className="w-8 lg:w-auto" />
          </div>
        </div>
        <div className="w-full flex justify-center mt-6">
          <button className="border border-[#0b2c3d] bg-[#af0808] hover:bg-[#0b2c3d] text-[white] rounded-sm transition-colors py-3 px-6 lg:px-10 text-sm lg:text-base" onClick={handleUpdateAbout}>
            Update About
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default UpdateAboutUsPage;
