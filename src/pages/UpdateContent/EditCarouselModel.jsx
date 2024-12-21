import React from 'react';
import { useState } from 'react';

function EditCarouselModel({
  EditModel,
  setEditModel,
  selectedCarousel,
  carouselData,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    title: carouselData.title || '',
    propertyName: carouselData.propertyName || '',
    room: carouselData.room || '',
    bath: carouselData.bath || '',
    kitchen: carouselData.kitchen || '',
    address: carouselData.address || '',
    area: carouselData.area || '',
    price: carouselData.price || '',
    propertyStatus: carouselData.propertyStatus || 'sale',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <div className="fixed top-0 right-0 z-9999 bottom-0 left-0 flex items-center justify-center">
      <div
        onClick={() => setEditModel(false)}
        className="absolute z-0 flex items-center justify-center top-0 right-0 bottom-0 left-0 bg-[#00000035]"
      ></div>
      <div className="popUpAnimation2 bg-white z-10 shadow-6 relative rounded-md">
        <div className="flex items-center justify-center h-12 w-12 rounded-full rounded-tl-none bg-gray-500 text-white absolute top-1 left-1">
          {selectedCarousel + 1}
        </div>
        <button
          onClick={handleSubmit}
          className="absolute bottom-1 right-1 border border-[#0b2c3d] bg-[#0b2c3d] hover:bg-[#0b2c3d18] text-[white] hover:text-[#0b2c3d] transition-colors py-3 px-4 rounded-br-[3px] text-sm"
        >
          Update Data
        </button>

        <div className="mt-20 p-4 flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="title"
              className="rounded-md outline-[#af0808] border-[#af080834] text-black border px-4 py-2 w-full"
            />
            <input
              type="text"
              name="propertyName"
              value={formData.propertyName}
              onChange={handleChange}
              placeholder="name"
              className="rounded-md outline-[#af0808] border-[#af080834] text-black border px-4 py-2 w-full"
            />

            <input
              type="number"
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="rounded-md outline-[#af0808] border-[#af080834] text-black border py-2 px-2 w-full"
              placeholder="bedrooms..."
            />
            <input
              type="number"
              name="bath"
              value={formData.bath}
              onChange={handleChange}
              className="rounded-md outline-[#af0808] border-[#af080834] text-black border py-2 px-2 w-full"
              placeholder="bathrooms..."
            />
            <input
              type="number"
              className="rounded-md outline-[#af0808] border-[#af080834] text-black border py-2 px-2 w-full"
              placeholder="kitchen..."
              name="kitchen"
              value={formData.kitchen}
              onChange={handleChange}
            />
          </div>
          <div className="">
            <textarea
              className="rounded-md outline-[#af0808] border-[#af080834] text-black border w-full px-4 py-2"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="address...."
            ></textarea>
          </div>
          <div className="flex gap-4">
            <input
              type="number"
              className="rounded-md outline-[#af0808] border-[#af080834] text-black border py-2 px-2 w-full"
              placeholder="area..."
              name="area"
              value={formData.area}
              onChange={handleChange}
            />
            <div className="w-full">
              <select
                className="rounded-md outline-[#af0808] appearance-none w-full border-[#af080834] text-black border py-2 px-7"
                name="propertyStatus"
                value={formData.propertyStatus}
                onChange={handleChange}
              >
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </div>
            <div className="w-full">
              <input
                type="text"
                className="rounded-md w-full outline-[#af0808] border-[#af080834] text-black border px-2 py-2"
                placeholder="price.."
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCarouselModel;
