import React from "react";
import { FaPlay } from "react-icons/fa";

const Timeline = () => {
  const items = [
    {
      id: 1,
      title: "1.Title",
      subtitle: "Sub title here",
      description:
        "Lorem ipsum dolor sit amet consectetur. Tellus id sodales dictumst ac in scelerisque diam amet. Sed odio tristique neque morbi etiam lorem metus consequat tempus. A arcu et accumsan ac",
    },
    {
      id: 2,
      title: "2.Title",
      subtitle: "Sub title here",
      description:
        "Lorem ipsum dolor sit amet consectetur. Tellus id sodales dictumst ac in scelerisque diam amet. Sed odio tristique neque morbi etiam lorem metus consequat tempus. A arcu et accumsan ac",
    },
    {
      id: 3,
      title: "3.Title",
      subtitle: "Sub title here",
      description:
        "Lorem ipsum dolor sit amet consectetur. Tellus id sodales dictumst ac in scelerisque diam amet. Sed odio tristique neque morbi etiam lorem metus consequat tempus. A arcu et accumsan ac",
    },
  ];

  return (
    <div className="bg-black text-white py-16 px-6">
      {/* Section Heading */}
      <h2 className="text-4xl font-serif font-semibold text-center mb-12">
        Our Timeline
      </h2>

      {/* Timeline Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col items-start">
            {/* Play Icon */}
            <div className="text-red-500 mb-4 text-2xl">
              <FaPlay className="border-2 border-red-500 rounded-md p-1 w-8 h-8" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>

            {/* Subtitle */}
            <p className="font-semibold mb-3">{item.subtitle}</p>

            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
