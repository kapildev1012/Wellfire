import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import axios from "axios";

const Timeline = () => {
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch upcoming projects from backend
  useEffect(() => {
    const fetchUpcomingProjects = async () => {
      try {
        setIsLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const response = await axios.get(`${backendUrl}/api/investment-product/list`);
        
        if (response.data.success && response.data.products) {
          // Filter for "Upcoming Projects" category
          const upcoming = response.data.products.filter(
            (product) => product.category === "Upcoming Projects"
          );
          setUpcomingProjects(upcoming);
        }
      } catch (error) {
        console.error("Error fetching upcoming projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingProjects();
  }, []);

  return (
    <div className="bg-black text-white py-12 px-4">
      {/* Section Heading */}
      <h2 className="text-2xl font-serif font-semibold text-center mb-8">
        Upcoming Projects
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : upcomingProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No upcoming projects available</p>
        </div>
      ) : (
        /* Timeline Items */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {upcomingProjects.map((project) => (
            <div key={project._id} className="flex flex-col items-start bg-gray-900 p-4 rounded-lg">
              {/* Project Image */}
              <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-800">
                <img
                  src={project.coverImage || project.image || "https://via.placeholder.com/400x300?text=Coming+Soon"}
                  alt={project.productTitle}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Play Icon */}
              <div className="text-red-500 mb-3 text-lg">
                <FaPlay className="border-2 border-red-500 rounded-md p-1 w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold mb-2">{project.productTitle}</h3>

              {/* Subtitle */}
              <p className="text-sm font-semibold mb-2">{project.artistName}</p>

              {/* Description - Limited to 3 lines */}
              <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                {project.description || "Exciting new project coming soon..."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;