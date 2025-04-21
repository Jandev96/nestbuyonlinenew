import React from "react";

import BannerCarousel from "../../components/user/BannerCarousel";
import ProductBanner from "../../components/user/ProductBanner";
import DealsOfTheDay from "../../components/user/DealsofTheDay";
import CircleCarousel from "../../components/user/CircleCarousel";



function Home() {


  

  return (
    <div>
     

<BannerCarousel />
<div className="w-full h-[600px] flex items-center justify-center px-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black overflow-hidden">
  <CircleCarousel
    baseWidth={500}
    autoplay={true}
    autoplayDelay={3000}
    pauseOnHover={false}
    loop={true}
    round={false}
  />
</div>


<ProductBanner />
<DealsOfTheDay />












     
    </div>
  );
}

export default Home;
