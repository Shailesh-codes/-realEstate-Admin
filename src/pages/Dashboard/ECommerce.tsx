import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import HomeIcon from '../../../public/assests/HomeIcon.svg'
import MoneyIcon from '../../../public/assests/MoneyIcon.svg'
import PropertyInquiry from '../../../public/assests/PropertyInquiry.svg'


const ECommerce: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Properties" total="245" rate="12.5%" rounded={true} levelUp>
        <img src={HomeIcon} alt="" />
        </CardDataStats>
        <CardDataStats title="" total="" rounded={false} rate="" >
           {/* <img src={MoneyIcon} alt="" /> */}<></>
        </CardDataStats>
        <CardDataStats title="Property Inquiries" total="156" rate="4.35%" rounded={false} levelUp>
         <img src={PropertyInquiry} alt="" />
        </CardDataStats>
        <CardDataStats title="" total="" rate="" rounded={false} >
          <></>
        </CardDataStats>
      </div>

      {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div> */}
    </>
  );
};

export default ECommerce;
