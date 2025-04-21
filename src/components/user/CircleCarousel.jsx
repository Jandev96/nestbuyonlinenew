import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const DEFAULT_ITEMS = [
  {
    title: "COffee",
    description: "Boost your energy with a sip...",
    id: 1,
    image: "https://i.pinimg.com/736x/21/93/a1/2193a1e0bddcdd10d0e540a3ddcf14fc.jpg",
  },
  {
    title: "APPLE AIRPODS PRO MAX",
    description: "A perfect sound master Bluetooth headphones 𝗙𝗲𝗮𝘁𝘂𝗿𝗲𝘀 ANC active noise cancellation ",
    id: 2,
    image: "https://i.pinimg.com/736x/20/7f/72/207f72b46ad8b45a62198e1514f6b5a8.jpg",
  },
  {
    title: "HOPESTAR H65",
    description: "20W Output Portable Bluetooth Speaker, H65",
    id: 3,
    image: "https://i.pinimg.com/736x/70/af/75/70af75569deb781bbfe713ed9db92947.jpg",
  },
  {
    title: "OREO",
    description: "Thrill your life with the sip of OREO.",
    id: 4,
    image: "https://i.pinimg.com/736x/7d/4d/35/7d4d351905bc8cabd12478d27ece4a39.jpg",
  },
  {
    title: "Lorel",
    description: "New age Lock unlocked",
    id: 5,
    image: "https://i.pinimg.com/736x/68/a0/01/68a00141652df03e5c4e9faaaabdf091.jpg",
  },
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function CircleCarousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
}) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const carouselItems = loop ? [...items, items[0]] : items;
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === items.length - 1 && loop) {
            return prev + 1;
          }
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [
    autoplay,
    autoplayDelay,
    isHovered,
    loop,
    items.length,
    carouselItems.length,
    pauseOnHover,
  ]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(items.length - 1);
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0,
        },
      };

  const currentItem = items[currentIndex % items.length];

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col md:flex-row items-center justify-center md:gap-8 gap-4 overflow-hidden"
      style={{ width: baseWidth + 250 }}
    >
      {/* Carousel */}
      <div
        className="relative overflow-hidden px-2 rounded-full"
        style={{
          width: `${baseWidth}px`,
          height: `${baseWidth}px`,
        }}
      >
        <motion.div
          className="flex"
          drag="x"
          {...dragProps}
          style={{
            width: itemWidth,
            gap: `${GAP}px`,
            perspective: 1000,
            perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
            x,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(currentIndex * trackItemOffset) }}
          transition={effectiveTransition}
          onAnimationComplete={handleAnimationComplete}
        >
          {carouselItems.map((item, index) => {
            const range = [
              -(index + 1) * trackItemOffset,
              -index * trackItemOffset,
              -(index - 1) * trackItemOffset,
            ];
            const outputRange = [90, 0, -90];
            const rotateY = useTransform(x, range, outputRange, { clamp: false });

            return (
              <motion.div
                key={index}
                className="relative shrink-0 flex items-center justify-center bg-[#060606] border-0"
                style={{
                  width: itemWidth,
                  height: baseWidth,
                  rotateY,
                  borderRadius: "50%",
                }}
                transition={effectiveTransition}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-full"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                currentIndex % items.length === index ? "bg-white" : "bg-gray-500"
              }`}
              animate={{
                scale: currentIndex % items.length === index ? 1.2 : 1,
              }}
              onClick={() => setCurrentIndex(index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>

      {/* Text Description */}
      <motion.div
        key={currentIndex % items.length}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-[90%] md:w-[200px] text-white text-center md:text-left space-y-2"
      >
        <h2 className="text-xl font-bold">{currentItem.title}</h2>
        <p className="text-sm">{currentItem.description}</p>
      </motion.div>
    </div>
  );
}
