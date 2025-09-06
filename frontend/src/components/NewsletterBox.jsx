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
    <div className="bg-black text-white py-12 px-4">
      {/* Section Heading */}
      <h2 className="text-2xl font-serif font-semibold text-center mb-8">
        Our Timeline
      </h2>

      {/* Timeline Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col items-start bg-gray-900 p-4 rounded-lg">
            {/* Play Icon */}
            <div className="text-red-500 mb-3 text-lg">
              <FaPlay className="border-2 border-red-500 rounded-md p-1 w-6 h-6" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>

            {/* Subtitle */}
            <p className="text-sm font-semibold mb-2">{item.subtitle}</p>

            {/* Description */}
            <p className="text-gray-300 text-xs leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
