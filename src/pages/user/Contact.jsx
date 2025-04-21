import React from "react";
import { StickyScroll } from "../../components/user/StickyScroll";
import SplashCursor from "../../lib/SplashCurser.jsx"; // Adjust the import path if needed

const contactContent = [
  {
    title: "Get in Touch",
    description: "Reach out to us anytime via email or phone. We're here to help you!",
    content: (
      <img
        src="https://i.pinimg.com/736x/97/bb/c3/97bbc3ecd90c4e146d4730cd64e8efa5.jpg"
        alt="Contact"
        className="w-full h-full object-cover opacity-75"
      />
    ),
  },
  {
    title: "Our Location",
    description: "Visit our office at 123 Main Street, Anytown. We love to meet our customers.",
    content: (
      <img
        src="https://i.pinimg.com/736x/a5/51/48/a5514808a0405a43b8c0f014976d4705.jpg"
        alt="Location"
        className="w-full h-full object-cover opacity-75"
      />
    ),
  },
  {
    title: "Support Team",
    description: "Our friendly support team is ready 24/7 to help solve any issues.",
    content: (
      <img
        src="https://i.pinimg.com/736x/2a/f7/1b/2af71bd1d4d9b04ee29906749443335e.jpg"
        alt="Support"
        className="w-full h-full object-cover opacity-75"
      />
    ),
  },
];

const Contact = () => {
  return (
    <main className="bg-black">
      <SplashCursor />
      <StickyScroll content={contactContent} />
    </main>
  );
};

export default Contact;
