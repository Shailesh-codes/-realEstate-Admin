import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';

function PropertiesDetails({ PDFIsOpen, property, setPDFIsOpen, PropertyImages }) {
  const {propertyId} = useParams();
  const pdfRef = useRef();


  const getImageUrl = () => {
    if (Array.isArray(property.PropertyImages) && property.PropertyImages.length > 0) {
      if (property.PropertyImages[0].image && property.PropertyImages[0].image.startsWith('data:image')) {
        return property.PropertyImages[0].image;
      }
      if (property.PropertyImages[0].url) {
        return property.PropertyImages[0].url;
      }
      if (property.PropertyImages[0].image) {
        return `data:image/jpeg;base64,${property.PropertyImages[0].image}`;
      }
    }
    return "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop";
  };

  const downloadPDF = async () => {
    const input = pdfRef.current;
    try {
      const canvas = await html2canvas(input, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // Increase quality
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio,
      );
      pdf.save('property-details.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!property) {
    return null;
  }

  return (

    <div className='flex my-10 justify-center items-center'>
      <div className="w-full max-w-[1000px] p-4 md:p-10 shadow-2xl relative max-h-[200vh]">
        <div ref={pdfRef} className="space-y-4 md:space-y-8">
          {/* Header */}
          <div className="text-center mb-4 md:mb-4">
            <h1 className="flex justify-center items-center text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              Properties Details Report
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-2">
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Property Details Section */}
          <div className="p-4 md:p-6 rounded-xl">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 border-b pb-4">
              Property Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="w-[90%]">
                <img
                  src={getImageUrl()}
                  alt="Property"
                  className="w-full h-48 md:h-80 object-cover rounded-xl shadow-lg"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  {property.name}
                </h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm md:text-base">
                      {property.location}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm md:text-base">
                      ₹{property.Price}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-4 mt-4 md:mt-6">
                  <div className="bg-white p-3 md:p-4 rounded-lg shadow-xl">
                    <p className="text-xs md:text-sm text-gray-500">Area</p>
                    <p className="text-base md:text-lg font-semibold">
                      {property.area} sq ft
                    </p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-lg shadow-xl">
                    <p className="text-xs md:text-sm text-gray-500">Bedrooms</p>
                    <p className="text-base md:text-lg font-semibold">
                      {property.bedrooms}
                    </p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-lg shadow-xl">
                    <p className="text-xs md:text-sm text-gray-500">
                      Bathrooms
                    </p>
                    <p className="text-base md:text-lg font-semibold">
                      {property.bathrooms}
                    </p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-lg shadow-xl">
                    <p className="text-xs md:text-sm text-gray-500">Garage</p>
                    <p className="text-base md:text-lg font-semibold">
                      {property.Garage}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 md:p-8 rounded-xl flex flex-col items-center justify-center gap-7 shadow-lg">
              <hr className="w-[55%] border-[#af0808]" />
              <div className="text-center space-y-1 md:space-y-2">
                <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-2 md:mb-4">
                  Real Estate Company Name
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  123 Business Street, Sector 1 New Delhi, India - 110001
                </p>
                {/* <p className="text-sm md:text-base text-gray-600"></p> */}
                <p className="text-sm md:text-base text-gray-600">
                  Phone: +91 98765 43210 | Email: contact@realestate.com
                </p>
                <p className="text-sm md:text-base text-gray-600"></p>
              </div>
            </div>
          </div>

          {/* QR Code Section
          <div className="flex justify-center mt-10" style={{width:'50%', margin:"0 autoo", backgroundColor: "white" }}>
            <QRCodeGenerator value={JSON.stringify(property)} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default PropertiesDetails;
