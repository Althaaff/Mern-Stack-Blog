import { useState, useEffect } from "react";
import reactImg from "../assets/react.png";
import cplus from "../assets/c++.png";
import javascript from "../assets/javascript.png";
import python from "../assets/python.png";

export default function ImageSlider() {
  const images = [reactImg, cplus, javascript, python];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full max-w-[320px] md:mt-10 mt-1 mb-7 mx-auto overflow-hidden rounded-md shadow-[0px_5px_15px_rgba(0,0,0,0.35)]
"
    >
      <div
        className="flex w-[320px] h-[320px] transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images ? (
          images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full flex-shrink-0 object-cover cursor-pointer"
            />
          ))
        ) : (
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShnJbKH7ZrSrYJcToxNBttRrbjOZ7wt3e1ow&s"
            alt="blog"
            className="w-full flex-shrink-0 object-cover cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
