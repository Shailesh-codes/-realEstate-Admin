import React from 'react';

const QRCodeGenerator = ({ id }) => {
  const url = `${window.location.origin}/properties/${id}`;
  return (
    <div className="flex justify-center items-center">
      <QRCodeGenerator value={url} size={256} viewBox={`0 0 256 256`} />
      <p className="mt-2 text-center">Scan to view property details</p>
    </div>
  );
};

export default QRCodeGenerator;
