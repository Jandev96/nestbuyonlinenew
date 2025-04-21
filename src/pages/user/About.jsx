import React, { useEffect, useState } from "react";
import { HeroParallax } from "../../components/user/HeroParallax";// Adjust the path if needed

const sampleProducts = [
  {
    title: "Modern UI Kit",
    thumbnail: "https://i.pinimg.com/736x/1d/7c/c4/1d7cc4f7cdbf51f9e2205cbca4ef3be7.jpg",
    link: "/product/1",
  },
  {
    title: "AI Tool",
    thumbnail: "https://i.pinimg.com/736x/21/35/fe/2135fe453a686d351cc617e42af067c5.jpg",
    link: "/product/2",
  },
  {
    title: "Productivity App",
    thumbnail: "https://i.pinimg.com/736x/40/e8/f9/40e8f9b8dc3a56b627c1e37ae1125a45.jpg",
    link: "/product/3",
  },
  {
    title: "E-commerce Template",
    thumbnail: "https://i.pinimg.com/736x/17/6a/c1/176ac167f179d3c100235ea57d6adb40.jpg",
    link: "/product/4",
  },
  {
    title: "Portfolio Website",
    thumbnail: "https://i.pinimg.com/736x/2c/03/3c/2c033cc48bbc630bc821be24d491de5b.jpg",
    link: "/product/5",
  },
  {
    title: "Creative Blog",
    thumbnail: "https://i.pinimg.com/736x/b6/d5/f1/b6d5f1b4a0dfc8e3b5956bb6f1cef48e.jpg",
    link: "/product/6",
  },
  {
    title: "ai toys",
    thumbnail: "https://i.pinimg.com/736x/4e/0c/3d/4e0c3d4d45ab24770979aeff30490553.jpg",
    link: "/product/7",
  },
  {
    title: "Phone Case",
    thumbnail: "https://i.pinimg.com/736x/1a/d6/b3/1ad6b3b4673da88d79bc9b57100ec762.jpg",
    link: "/product/8",
  },
  {
    title: "Music ",
    thumbnail: "https://i.pinimg.com/736x/11/c0/b2/11c0b23b0dbf3a12a8466d8d8c5f9d72.jpg",
    link: "/product/9",
  },
  {
    title: "Foot wear",
    thumbnail: "https://i.pinimg.com/736x/51/1c/9f/511c9faaf94b1e1658235e7286489553.jpg",
    link: "/product/10",
  },
  {
    title: "watches",
    thumbnail: "https://i.pinimg.com/736x/1b/b4/7b/1bb47bbe767e8aae9414707ab8562b1d.jpg",
    link: "/product/11",
  },
  {
    title: "GAME CONTROLLERS",
    thumbnail: "https://i.pinimg.com/736x/af/a2/fd/afa2fda9aa745fee38d7d44e1eb96c28.jpg",
    link: "/product/12",
  },
  {
    title: "cAMERA",
    thumbnail: "https://i.pinimg.com/736x/c4/9f/b6/c49fb6b267f663c13350bc834ce2685d.jpg",
    link: "/product/13",
  },
  {
    title: "SPORTS",
    thumbnail: "https://i.pinimg.com/736x/cb/f6/17/cbf617e448758565613b126c68a484e1.jpg",
    link: "/product/14",
  },
  {
    title: "books",
    thumbnail: "https://i.pinimg.com/736x/f2/d7/e0/f2d7e0ba1dbad637032d0d3f21f95a59.jpg",
    link: "/product/15",
  },
];

const About = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // You can replace this with real data from backend
    setProducts(sampleProducts);
  }, []);

  return (
    <div>
      <HeroParallax products={products} />
    </div>
  );
};

export default About;
