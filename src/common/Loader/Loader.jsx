import React from 'react'
import Lottie from "react-lottie";
import animationData from "../../../public/Lotties/HuKmn3378c.json";


function Loader() {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className='fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-white z-50'>
            <Lottie options={defaultOptions}
                height={200}
                width={200}
            />
        </div>
    )
}

export default Loader
