import React, { useEffect, useState } from "react";
import chef from "../../Assests/Images/chef1.png";
import babySitting from "../../Assests/Images/babySitting1.png";
import cleaner from "../../Assests/Images/clean.png";
import tutor from "../../Assests/Images/tutor.png";
import vet from "../../Assests/Images/vet.png";
import teacherN from "../../Assests/Images/teacherN.png";
import { motion } from "framer-motion";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import "../../Styles/Home.css";
const HeroData = [
  {
    id: 1,
    image: chef,
    title: "SereniLux",
    Subtitles: "Simplify Life. Empower Dreams. Start Today",
    bgColor: "#ffffff",
    buttonText: "Book Now",
  },
  {
    id: 2,
    image: babySitting,
    title: "SereniLux",
    Subtitles: "Care for You, Your Family, and Your Future — All in One Place.",
    bgColor: "#ffffff",
    buttonText: "Book Now",
  },
  {
    id: 3,
    image: cleaner,
    title: "SereniLux",
    Subtitles: "Trusted Cleaners to Keep Your Space Fresh and Shining.",
    bgColor: "#ffffff",
    buttonText: "Book Now",
  },
  {
    id: 4,
    image: tutor,
    title: "SereniLux",
    Subtitles: "Learn Smarter, Not Harder — With Our Best Tutors!",
    bgColor: "#ffffff",
    buttonText: "Book Now",
  },
  {
    id: 5,
    image: teacherN,
    title: "SereniLux",
    Subtitles: "Unlock Your Full Potential with Professional Tutors",
    bgColor: "#ffffff",
    buttonText: "Book Now",
  },
  {
    id: 6,
    image: vet,
    title: "SereniLux",
    Subtitles: "Love, Walks, and Wagging Tails – We've Got It Covered!",
    bgColor: "#ffffff",
    buttonText: "Book Now",
  },
];

export default function HomePage() {
  const [activeData, setActiveData] = useState(HeroData[0]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === HeroData.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? HeroData.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="hero-slider ">
      {HeroData.map((data, index) => (
        <motion.div
          key={index}
          className={`slide ${index === currentSlide ? "active" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: data.bgColor }}
        >
          <div className="slide-content">
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {data.title}
            </motion.h1>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {data.Subtitles}
            </motion.p>
            <motion.a
              className="btn-cta"
              href="/my-bookings"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              {data.buttonText}
            </motion.a>
          </div>
          <motion.div
            className="slide-image"
            initial={{ scale: 1 }}
            animate={{ scale: index === currentSlide ? 1.05 : 1 }}
            transition={{ duration: 8, ease: "easeInOut" }}
          >
            <img src={data.image} alt={data.title} />
          </motion.div>
        </motion.div>
      ))}
      <div className="slider-control">
        <button className="control prev" onClick={goToPrev}>
          <FaChevronCircleLeft />
        </button>
        <div className="pagination-dot">
          {HeroData.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide}
            />
          ))}
        </div>
        <buton className="control next" onClick={goToNext}>
          <FaChevronCircleRight />
        </buton>
      </div>
    </div>
  );
}
