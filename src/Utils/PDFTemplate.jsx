import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function PDFTemplate({PDFIsOpen, setPDFIsOpen, property}) {
  const pdfRef = useRef();

  const downloadPDF = async () => {
    const input = pdfRef.current;
    try {
      const canvas = await html2canvas(input, {
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        scale: 2 // Increase quality
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

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('property-details.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!property) {
    return null;
  }

  

  return (
    <div className='fixed z-[9999] top-0 right-0 bottom-0 left-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'>
      <div className="ScrollBar bg-white w-full max-w-[900px] p-4 md:p-10 shadow-2xl relative max-h-[90vh] overflow-y-scroll">
        <div ref={pdfRef} className="space-y-4 md:space-y-8">
          {/* Header */}
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Property Details Report</h1>
            <p className="text-sm md:text-base text-gray-500 mt-2">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          {/* Property Details Section */}
          <div className="bg-gray-50 p-4 md:p-8 rounded-xl">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 border-b pb-4">Property Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="w-full">
                <img 
                  src={property.img}
                  alt="Property" 
                  className="w-full h-48 md:h-80 object-cover rounded-xl shadow-lg"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">{property.name}</h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm md:text-base">{property.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm md:text-base">₹{property.Price}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 md:gap-4 mt-4 md:mt-6">
                  <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                    <p className="text-xs md:text-sm text-gray-500">Area</p>
                    <p className="text-base md:text-lg font-semibold">{property.area} sq ft</p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                    <p className="text-xs md:text-sm text-gray-500">Bedrooms</p>
                    <p className="text-base md:text-lg font-semibold">{property.bedrooms}</p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                    <p className="text-xs md:text-sm text-gray-500">Bathrooms</p>
                    <p className="text-base md:text-lg font-semibold">{property.bathrooms}</p>
                  </div>
                  <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                    <p className="text-xs md:text-sm text-gray-500">Garage</p>
                    <p className="text-base md:text-lg font-semibold">{property.Garage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details Section */}
          <div className="bg-gray-50 p-4 md:p-8 rounded-xl flex flex-col items-center justify-center gap-7">
            <hr className='w-[55%] border-[#af0808]'  />
            <div className="text-center space-y-1 md:space-y-2">
              <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-2 md:mb-4">Real Estate Consultant</h3>
              <p className="text-sm md:text-base text-gray-600">123 Business Street, Sector 1 New Delhi, India - 110001</p>
              {/* <p className="text-sm md:text-base text-gray-600"></p> */}
              <p className="text-sm md:text-base text-gray-600">Phone: +91 98765 43210   |    Email: contact@realestate.com</p>
              <p className="text-sm md:text-base text-gray-600"></p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button 
          onClick={downloadPDF}
          className="fixed md:absolute top-2 md:top-6 left-2 md:left-6 bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Download PDF
        </button>

        {/* Close Button */}
        <button 
          onClick={()=>setPDFIsOpen(false)} 
          className="fixed md:absolute top-2 md:top-6 right-2 md:right-6 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 md:p-2 hover:bg-gray-100 transition-colors duration-300"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default PDFTemplate;
