import Image from "next/image";
import { useEffect, useState } from "react";

export default function Carousel({
  images,
  slideDuration,
}: {
  images: string[];
  slideDuration: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, slideDuration);

    return () => clearInterval(timer);
  }, [images, slideDuration]);

  return (
    <div className="relative w-[500] h-[500] overflow-hidden">
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Slide ${index + 1}`}
          fill
          className={`absolute transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
