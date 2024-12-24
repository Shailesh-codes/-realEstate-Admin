import React from 'react';
import ColorableSvg from '../hooks/ColorableSvg';
import DeleteIconSVGComponent from '../../public/assests/SVGComponents/deleteIcon'; 

const DeletePopup = ({ isOpen, onClose, onDelete, itemName }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed flex items-center justify-center top-0 right-0 bottom-0 left-0 bg-[#00000077] z-9999">
          <div className="w-80 p-6 bg-white rounded-3xl shadow-lg">
            <div className="flex flex-col items-center">
              <div className="p-4 mb-4 rounded-full bg-[#f4eded]">
                <ColorableSvg>
                  <DeleteIconSVGComponent />
                </ColorableSvg>
              </div>

              <h2 className="mb-2 text-2xl font-bold text-black">Delete {itemName}</h2>
              <p className="mb-6 text-sm text-center text-black capitalize">
                Are you sure you want to delete this {itemName}?
              </p>
              <div className="flex justify-center space-x-4 w-full">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-bold text-[#dc2626] rounded-md hover:bg-[#f4eded]"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  className="px-4 py-2 text-sm font-bold text-white bg-[#ce2626e9] rounded-md hover:bg-[#dc2626]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeletePopup;
