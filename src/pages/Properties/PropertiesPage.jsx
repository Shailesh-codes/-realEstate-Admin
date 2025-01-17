import React, { useEffect, useState, useRef } from 'react';
import PropertyCardComp from '../../components/PropertyCardComp';
import Arrow from '../../../public/assests/ArrowDown.svg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../../hooks/useApi';
import AddPropModel from './AddPropModel';
import { FiSearch, FiSliders, FiMap, FiGrid } from 'react-icons/fi';
import DeletePopup from '../../Authentication/deletePopUp';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Companylogo from '../../../public/assests/images/CompanyLogo.png';
import Whatsapp from "../../../public/assests/images/whatsapp.svg";

function PropertiesPage() {
  const [SelectedProp, setSelectedProp] = useState('All');
  const [selectedPage, setSelectedPage] = useState(1);
  const itemPerPage = 4;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [pdfIsOpen, setPdfIsOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const pdfRef = useRef();

  // New filter states
  const [priceRange, setPriceRange] = useState('All');
  const [bedroomFilter, setBedroomFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Add bedroom options state and handler
  const [bedroomOptions] = useState(['1', '2', '3', '4', '5+']);

  // Add these state variables at the top with other state declarations
  const [hidePropertyName, setHidePropertyName] = useState(false);
  const [hidePropertyLocation, setHidePropertyLocation] = useState(false);

  // Clear filters function
  const clearFilters = () => {
    setSelectedProp('All');
    setPriceRange('All');
    setBedroomFilter('All');
    setSortOrder('default');
    setSearchQuery('');
  };

  // Handle bedroom filter click
  const handleBedroomFilter = (beds) => {
    setBedroomFilter(beds === bedroomFilter ? 'All' : beds);
  };

  // Format price for display
  const formatPrice = (range) => {
    if (range === 'All') return 'Any Price';
    const [min, max] = range.split('-').map(Number);
    if (!max) return `$${min / 1000}k+`;
    return `$${min / 1000}k - $${max / 1000}k`;
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api}/properties`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (
          result.success &&
          result.properties &&
          Array.isArray(result.properties)
        ) {
          const propertiesWithImages = result.properties.map((property) => ({
            ...property,
            img:
              property.PropertyImages?.[0]?.url ||
              'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop',
            For: property.propertyFor || 'All',
            Garage: property.garage,
            Price: property.price,
            createdAt: new Date(property.createdAt).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            ),
            Address: property.address,
          }));
          setProperties(propertiesWithImages);
        } else {
          setProperties([]);
        }
      } catch (err) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    let filtered = [...properties];

    // Property type filter
    if (SelectedProp !== 'All') {
      filtered = filtered.filter(
        (item) => item.For?.toLowerCase() === SelectedProp.toLowerCase(),
      );
    }

    // Price range filter
    if (priceRange !== 'All') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(
        (item) => item.Price >= min && (max ? item.Price <= max : true),
      );
    }

    // Bedroom filter
    if (bedroomFilter !== 'All') {
      filtered = filtered.filter(
        (item) => item.bedrooms === parseInt(bedroomFilter),
      );
    }

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.address &&
            item.address.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    // Sorting
    if (sortOrder === 'price-asc') {
      filtered.sort((a, b) => a.Price - b.Price);
    } else if (sortOrder === 'price-desc') {
      filtered.sort((a, b) => b.Price - a.Price);
    }

    setFilteredData(filtered);
  }, [
    SelectedProp,
    properties,
    priceRange,
    bedroomFilter,
    sortOrder,
    searchQuery,
  ]);

  function HandleBackwardClick() {
    if (selectedPage > 1) {
      setSelectedPage(selectedPage - 1);
    } else {
      setSelectedPage(Math.ceil(filteredData.length / itemPerPage));
    }
  }

  function HandleForwardClick() {
    const totalPages = Math.ceil(filteredData.length / itemPerPage);
    if (selectedPage < totalPages) {
      setSelectedPage(selectedPage + 1);
    } else {
      setSelectedPage(1);
    }
  }

  const handlePropertySelect = (propertyId) => {
    setSelectedProperties((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      }
      return [...prev, propertyId];
    });
  };

  const getImageUrl = (property) => {
    if (property.images && property.images.length > 0) {
      return `data:image/jpeg;base64,${property.images[0].image}`;
    }
    if (property.PropertyImages && property.PropertyImages.length > 0) {
      return `data:image/jpeg;base64,${property.PropertyImages[0].image}`;
    }
    return 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop';
  };

  

  const downloadPDF = async () => {
    const input = pdfRef.current;
    try {
      // Pre-load all images
      const imagePromises = selectedProperties.map((propId) => {
        const property = properties.find((p) => p.id === propId);
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = getImageUrl(property);
        });
      });

      // Wait for all images to load
      await Promise.all(imagePromises);

      const canvas = await html2canvas(input, {
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        scale: 2,
        logging: true,
        imageTimeout: 0,
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
      toast.error('Error generating PDF');
    }
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  // Update the delete handler
  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setDeleteModalOpen(true);
  };

  // Update the delete confirmation handler
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${api}/properties/${propertyToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      if (result.success) {
        setProperties((prevProperties) =>
          prevProperties.filter((p) => p.id !== propertyToDelete.id),
        );
        setFilteredData((prevFiltered) =>
          prevFiltered.filter((p) => p.id !== propertyToDelete.id),
        );
        toast.success('Property deleted successfully');
      } else {
        toast.error(result.message || 'Error deleting property');
      }
    } catch (error) {
      toast.error('Error deleting property');
    } finally {
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
    }
  };

  //   if (loading) {
  //     return <div className="flex justify-center items-center h-screen">Loading properties...</div>;
  //   }

  return (
    <div>
      <div
        className="w-full h-48 sm:h-72 mt-16 sm:mt-20 relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2084&auto=format&fit=crop'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute z-0 top-0 right-0 bottom-0 left-0 bg-[#0b2c3d5b]"></div>
        <div className="flex relative z-10 flex-col items-center justify-center gap-7">
          <span className="text-[#af0808] text-sm bg-white px-4 py-1 rounded-full">
            Our Properties
          </span>
          <h1 className="text-4xl font-bold text-white uppercase">
            Properties
          </h1>
        </div>
      </div>

      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#af0808]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              <select
                value={SelectedProp}
                onChange={(e) => setSelectedProp(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-sm sm:text-base"
              >
                <option value="All">Property Type</option>
                <option value="buy">For Buy</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-sm sm:text-base"
              >
                <option value="All">Price Range</option>
                <option value="0-100000">Under $100,000</option>
                <option value="100000-300000">$100,000 - $300,000</option>
                <option value="300000-500000">$300,000 - $500,000</option>
                <option value="500000-1000000">$500,000 - $1,000,000</option>
                <option value="1000000">$1,000,000+</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg text-sm sm:text-base col-span-2 sm:col-span-1"
              >
                <option value="default">Sort By</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3">
            <div className="text-sm sm:text-base text-gray-600">
              <span className="font-semibold text-gray-900">
                {filteredData.length}
              </span>{' '}
              properties found
              {(SelectedProp !== 'All' ||
                priceRange !== 'All' ||
                bedroomFilter !== 'All' ||
                searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="ml-3 text-[#af0808] hover:text-[#8f0606] text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => setModelOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2 bg-[#af0808] hover:bg-[#8f0606] text-white rounded-lg text-sm sm:text-base"
              >
                Add Property
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#af0808] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FiGrid size={20} />
                </button>

                <button
                  onClick={() => setViewMode('map')}
                  className={`hidden sm:block p-2 rounded-lg transition-colors ${
                    viewMode === 'map'
                      ? 'bg-[#af0808] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FiMap size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-2 px-2">
            {bedroomOptions.map((beds) => (
              <button
                key={beds}
                onClick={() => handleBedroomFilter(beds)}
                className={`px-3 sm:px-4 py-1.5 border rounded-full text-xs sm:text-sm ${
                  bedroomFilter === beds
                    ? 'border-[#af0808] text-[#af0808] bg-[#af080810]'
                    : 'border-gray-200 hover:border-[#af0808] hover:text-[#af0808]'
                } whitespace-nowrap`}
              >
                {beds} {beds === '5+' ? 'or more beds' : 'bed'}
              </button>
            ))}
          </div>

          {(SelectedProp !== 'All' || priceRange !== 'All' || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {SelectedProp !== 'All' && (
                <span className="px-3 py-1 bg-[#af080810] text-[#af0808] rounded-full text-sm">
                  Type: {SelectedProp}
                  <button
                    onClick={() => setSelectedProp('All')}
                    className="ml-2 hover:text-[#8f0606]"
                  >
                    ×
                  </button>
                </span>
              )}
              {priceRange !== 'All' && (
                <span className="px-3 py-1 bg-[#af080810] text-[#af0808] rounded-full text-sm">
                  Price: {formatPrice(priceRange)}
                  <button
                    onClick={() => setPriceRange('All')}
                    className="ml-2 hover:text-[#8f0606]"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-[#af080810] text-[#af0808] rounded-full text-sm">
                  Search: {searchQuery}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-[#8f0606]"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-2 sm:px-4 lg:px-6 py-6 sm:py-8 md:py-12">
        <div
          className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
              : 'flex flex-col gap-4 sm:gap-6'
          }`}
        >
          {loading ? (
            // Loading skeleton
            Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 h-[400px] rounded-xl"
                ></div>
              ))
          ) : filteredData.length === 0 ? (
            // No results
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500 text-lg">
                No properties found matching your criteria
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-[#af0808] hover:text-[#8f0606]"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            // Property cards
            filteredData
              .slice(
                selectedPage * itemPerPage - itemPerPage,
                selectedPage * itemPerPage,
              )
              .map((property) => (
                <PropertyCardComp
                  key={property.id}
                  {...property}
                  img={property.images}
                  isSelected={selectedProperties.includes(property.id)}
                  onSelect={handlePropertySelect}
                  onDelete={() => handleDeleteClick(property)}
                  viewMode={viewMode}
                />
              ))
          )}
        </div>
      </div>

      <div className="h-24 sm:h-32 flex items-center justify-center px-2 sm:px-4 lg:px-16 gap-2 sm:gap-3">
        <div
          onClick={HandleBackwardClick}
          className="border h-9 w-9 flex items-center justify-center rotate-90 rounded-md border-[#decfcf] cursor-pointer"
        >
          <img src={Arrow} alt="" />
        </div>

        {selectedPage > 2 && (
          <div
            onClick={() => setSelectedPage(1)}
            className="cursor-pointer border h-10 w-10 flex items-center justify-center rounded-md border-[#decfcf]"
          >
            1
          </div>
        )}

        {selectedPage > 3 && (
          <div className="cursor-pointer border h-10 w-10 flex items-center justify-center rounded-md border-[#decfcf]">
            ...
          </div>
        )}

        {Array.from(
          { length: Math.ceil(filteredData.length / itemPerPage) },
          (_, i) => i + 1,
        )
          .filter((pageNum) => {
            return (
              pageNum === selectedPage ||
              pageNum === selectedPage - 1 ||
              pageNum === selectedPage + 1
            );
          })
          .map((pageNum) => (
            <div
              key={pageNum}
              onClick={() => setSelectedPage(pageNum)}
              className={`cursor-pointer border h-10 w-10 flex items-center justify-center rounded-md ${
                selectedPage === pageNum
                  ? 'border-[#dc2626]'
                  : 'border-[#decfcf]'
              }`}
            >
              {pageNum}
            </div>
          ))}

        {selectedPage < Math.ceil(filteredData.length / itemPerPage) - 2 && (
          <div className="cursor-pointer border h-10 w-10 flex items-center justify-center rounded-md border-[#decfcf]">
            ...
          </div>
        )}

        {selectedPage < Math.ceil(filteredData.length / itemPerPage) - 1 && (
          <div
            onClick={() =>
              setSelectedPage(Math.ceil(filteredData.length / itemPerPage))
            }
            className={`cursor-pointer border h-10 w-10 flex items-center justify-center rounded-md ${
              selectedPage === Math.ceil(filteredData.length / itemPerPage)
                ? 'border-[#dc2626]'
                : 'border-[#decfcf]'
            }`}
          >
            {Math.ceil(filteredData.length / itemPerPage)}
          </div>
        )}

        <div
          onClick={HandleForwardClick}
          className="border h-9 w-9 flex items-center justify-center -rotate-90 rounded-md border-[#decfcf] cursor-pointer"
        >
          <img src={Arrow} alt="" />
        </div>
      </div>
      <AddPropModel modelOpen={modelOpen} setModelOpen={setModelOpen} />

      {selectedProperties.length > 0 && (
        <>
          <div className="fixed bottom-4 right-4 z-50 flex gap-2">
            <a
              href={`https://wa.me/?text=Check out these properties: ${selectedProperties
                .map(propId => {
                  const property = properties.find(p => p.id === propId);
                  return `${property.name} - ₹${property.price?.toLocaleString()}`
                })
                .join(', ')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#128C7E] flex items-center gap-2"
            >
              <img src={Whatsapp} alt="WhatsApp" className="w-5 h-5" />
              Share on WhatsApp
            </a>
            <button
              onClick={() => setPdfIsOpen(true)}
              className="bg-[#af0808] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#8f0606]"
            >
              Generate PDF
            </button>
          </div>

          {pdfIsOpen && (
            <div className="fixed z-[9999] top-0 right-0 bottom-0 left-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
              <div className="ScrollBar bg-white w-full max-w-[900px] p-3 sm:p-4 md:p-10 shadow-2xl relative max-h-[90vh] overflow-y-scroll">
                {/* New Styled PDF Options */}
                <div className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-md">
                  <div className="p-9">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        <span className="text-[#af0808]">PDF</span> Settings
                      </h3>
                      <div className="text-sm text-gray-500">
                        Customize your PDF output
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Property Name Toggle */}
                      <div className="relative inline-flex">
                        <div
                          className={`
                          flex items-center justify-between w-full p-4 
                          rounded-lg transition-all duration-300
                          ${hidePropertyName ? 'bg-gray-200' : 'bg-white'}
                          border-2 ${
                            hidePropertyName
                              ? 'border-gray-300'
                              : 'border-[#af0808]'
                          }
                          cursor-pointer hover:shadow-md
                        `}
                          onClick={() => setHidePropertyName(!hidePropertyName)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`
                              p-2 rounded-full
                              ${
                                hidePropertyName
                                  ? 'bg-gray-400'
                                  : 'bg-[#af0808]'
                              }
                            `}
                            >
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d={
                                    hidePropertyName
                                      ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                      : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                  }
                                />
                              </svg>
                            </div>
                            <span className="font-medium text-gray-700">
                              Property Name
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {hidePropertyName ? 'Hidden' : 'Visible'}
                          </span>
                        </div>
                      </div>

                      {/* Property Location Toggle */}
                      <div className="relative inline-flex">
                        <div
                          className={`
                          flex items-center justify-between w-full p-4 
                          rounded-lg transition-all duration-300
                          ${hidePropertyLocation ? 'bg-gray-200' : 'bg-white'}
                          border-2 ${
                            hidePropertyLocation
                              ? 'border-gray-300'
                              : 'border-[#af0808]'
                          }
                          cursor-pointer hover:shadow-md
                        `}
                          onClick={() =>
                            setHidePropertyLocation(!hidePropertyLocation)
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`
                              p-2 rounded-full
                              ${
                                hidePropertyLocation
                                  ? 'bg-gray-400'
                                  : 'bg-[#af0808]'
                              }
                            `}
                            >
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d={
                                    hidePropertyLocation
                                      ? 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                      : 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                  }
                                />
                              </svg>
                            </div>
                            <span className="font-medium text-gray-700">
                              Property Location
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {hidePropertyLocation ? 'Hidden' : 'Visible'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div ref={pdfRef} className="space-y-4 md:space-y-8">
                  {/* Header with Company Logo */}
                  <div className="text-center mb-4 md:mb-8 relative">
                    <img 
                      src={Companylogo} 
                      alt="Company Logo" 
                      className="w-24 sm:w-28  lg:w-20 h-auto object-contain mx-auto mb-4"
                    />
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                      Property Details Report
                    </h1>
                    <p className="text-sm md:text-base text-gray-500 mt-2">
                      Generated on {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  {selectedProperties.map((propId) => {
                    const property = properties.find((p) => p.id === propId);
                    return (
                      <div
                        key={property.id}
                        className="bg-gray-50 p-4 md:p-8 rounded-xl"
                      >
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 border-b pb-4">
                          Property Overview
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                          <div className="w-full">
                            <img
                              src={getImageUrl(property)}
                              alt="Property"
                              className="w-full h-48 md:h-80 object-cover rounded-xl shadow-lg"
                              crossOrigin="anonymous"
                            />
                          </div>
                          <div className="space-y-4">
                            {/* Property Name - Conditional Render */}
                            {!hidePropertyName && (
                              <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                                {property.name}
                              </h3>
                            )}

                            <div className="space-y-2 md:space-y-3">
                              {/* Location information - Conditional Render */}
                              {!hidePropertyLocation && (
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm text-gray-500">
                                    Location
                                  </span>
                                  <span className="text-base text-gray-800">
                                    {property.address ||
                                      property.location ||
                                      'Address not available'}
                                  </span>
                                </div>
                              )}

                              {/* Price information */}
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-500">
                                  Price
                                </span>
                                <span className="text-lg font-semibold text-gray-800">
                                  ₹
                                  {property.price?.toLocaleString() ||
                                    property.Price?.toLocaleString()}
                                </span>
                              </div>

                              {/* Property Type */}
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-500">
                                  Property For
                                </span>
                                <span className="text-base text-gray-800 capitalize">
                                  {property.propertyFor ||
                                    property.For ||
                                    'Not specified'}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 md:gap-4 mt-4 md:mt-6">
                              <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                                <p className="text-xs md:text-sm text-gray-500">
                                  Area
                                </p>
                                <p className="text-base md:text-lg font-semibold">
                                  {property.area} sq ft
                                </p>
                              </div>
                              <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                                <p className="text-xs md:text-sm text-gray-500">
                                  Bedrooms
                                </p>
                                <p className="text-base md:text-lg font-semibold">
                                  {property.bedrooms}
                                </p>
                              </div>
                              <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                                <p className="text-xs md:text-sm text-gray-500">
                                  Bathrooms
                                </p>
                                <p className="text-base md:text-lg font-semibold">
                                  {property.bathrooms}
                                </p>
                              </div>
                              <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                                <p className="text-xs md:text-sm text-gray-500">
                                  Garage
                                </p>
                                <p className="text-base md:text-lg font-semibold">
                                  {property.Garage}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Company Details Section */}
                  <div className="bg-gray-50 p-4 md:p-8 rounded-xl flex flex-col items-center justify-center gap-7">
                    <hr className="w-[55%] border-[#af0808]" />
                    <div className="text-center space-y-1 md:space-y-2">
                      <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-2 md:mb-4">
                        Anmol Real Estate Consultant
                      </h3>
                      <p className="text-sm md:text-base text-gray-600">
                        123 Business Street, Sector 1 New Delhi, India - 110001
                      </p>
                      <p className="text-sm md:text-base text-gray-600">
                        Phone: +91 98765 43210 | Email: contact@realestate.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={downloadPDF}
                  className="fixed md:absolute top-2 md:top-5 left-2 md:left-6 hover:bg-[#af0808] bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF
                  </button>
                {/* <div className="absolute top-2 lg:top-4 left-1/2 transform -translate-x-1/2">
                  <img 
                    src={Companylogo} 
                    alt="Company Logo" 
                    className="w-24 sm:w-28 md:w-32 lg:w-40 h-auto object-contain"
                  />
                </div> */}

                {/* Close Button */}
                <button
                  onClick={() => setPdfIsOpen(false)}
                  className="fixed md:absolute top-2 md:top-6 right-2 md:right-6 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 md:p-2 hover:bg-gray-100 transition-colors duration-300"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {deleteModalOpen && (
        <DeletePopup
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setPropertyToDelete(null);
          }}
          onDelete={handleDeleteConfirm}
          itemName="property"
        />
      )}

      <ToastContainer position="top-right" />
    </div>
  );
}

export default PropertiesPage;
