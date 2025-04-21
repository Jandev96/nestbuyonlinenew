import React from "react";
import { BentoGrid, BentoGridItem } from "./BentoGrid"; // Adjust path if needed
import { InteractiveHoverButton } from "../registry/magicui/InteractiveHoverButton"; // Ensure correct path
import { useNavigate } from "react-router-dom";

const DealsOfTheDay = () => {
  const Skeleton = ({ image }) => (
    <div className="relative w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
      <img
        src={image}
        alt="Deal"
        className="w-full h-full object-cover transition-transform duration-300 group-hover/bento:scale-105"
        loading="lazy"
      />
    </div>
  );

  const navigate= useNavigate()

  const deals = [
    {
      title: "Bluetooth Headphones",
      description: "Starting at ₹1,290",
      image: "https://i.pinimg.com/736x/c9/d3/d9/c9d3d9497ff6778e67c4538fd1067837.jpg",
      className: "md:col-span-2",
    },
    {
      title: "Mixers, Blenders, Air Fryers",
      description: "Starting at ₹499",
      image: "https://i.pinimg.com/736x/90/62/bb/9062bbce12f670cba0f507d3d8ce16d5.jpg",
      className: "md:col-span-1",
    },
    {
      title: "Power Banks",
      description: "Starting at ₹751",
      image: "https://i.pinimg.com/736x/12/76/fe/1276fee2c9f18f411d2fca0d98e2612a.jpg",
      className: "md:col-span-1",
    },
    {
      title: "Smartwatch",
      description: "Galaxy Fit 3 – Limited Deal",
      image: "https://i.pinimg.com/736x/77/b6/bb/77b6bba1bf8921f80b95a3ba26dbef93.jpg",
      className: "md:col-span-2",
    },
    {
      title: "Gaming Console",
      description: "Starts from ₹15,990",
      image: "https://i.pinimg.com/736x/38/9a/0d/389a0d4da4eb83eeeaa68fe7a561ea72.jpg",
      className: "md:col-span-3 ",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white px-3 py-1 rounded-md inline-block 
                       animate-bounce 
                       bg-gradient-to-r from-yellow-500 to-gray-700 
                       shadow-lg
                       hover:shadow-[0_0_15px_#b45309,0_0_30px_#9ca3af]
                       transition-all duration-500">
          Deals Of The Day
        </h2>
        
        <InteractiveHoverButton
      onClick={() => {
        navigate("/products"); // SPA-style navigation (no refresh)
      }}
    >
      Shop Now
    </InteractiveHoverButton>
      </div>

      {/* Deals Grid */}
      <BentoGrid className="md:grid-cols-3 md:auto-rows-[20rem]">
        {deals.map((deal, index) => (
          <BentoGridItem
            key={index}
            title={deal.title}
            description={deal.description}
            className={deal.className}
            header={<Skeleton image={deal.image} />}
          />
        ))}
      </BentoGrid>
    </div>
  );
};

export default DealsOfTheDay;
