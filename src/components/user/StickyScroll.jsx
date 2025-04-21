"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const StickyScroll = ({ content, contentClassName }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const sectionSize = 1 / cardLength;
    const index = Math.min(
      Math.floor(latest / sectionSize),
      cardLength - 1
    );
    setActiveCard(index);
  });

  return (
    <div ref={ref} className="relative flex flex-col lg:flex-row w-full min-h-screen bg-black">
      {/* Left Scrollable Content */}
      <div className="w-full lg:w-1/2">
        {content.map((item, index) => (
          <div
            key={item.title + index}
            className="min-h-screen flex items-center px-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: activeCard === index ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h2 className="text-4xl font-bold text-slate-100">
                {item.title}
              </h2>
              <p className="mt-6 text-lg text-slate-300">
                {item.description}
              </p>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Right Fixed Center Image */}
      <div className="hidden lg:block w-full lg:w-1/2 relative">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "w-[24rem] h-[24rem] rounded-xl overflow-hidden shadow-2xl bg-transparent",
              contentClassName
            )}
          >
            {content[activeCard].content ?? null}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
