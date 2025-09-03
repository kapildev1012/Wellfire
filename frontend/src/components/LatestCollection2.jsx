import React, { useState, useEffect } from "react";

// Portfolio data with YouTube videos
const portfolioData = {
  music: {
    videos: [
      {
        id: "dQw4w9WgXcQ", // Rick Astley - Never Gonna Give You Up
        title: "Midnight Symphony",
        description:
          "An ethereal journey through electronic soundscapes and orchestral arrangements that captures the essence of late-night creativity",
        duration: "3:45",
        year: "2024",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        id: "9bZkp7q19f0", // PSY - GANGNAM STYLE
        title: "Urban Beats",
        description:
          "Hip-hop fusion with jazz influences, recorded live in downtown studios with cutting-edge production techniques",
        duration: "4:12",
        year: "2024",
        url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      },
      {
        id: "kJQP7kiw5Fk", // Luis Fonsi - Despacito
        title: "Acoustic Sessions",
        description:
          "Intimate acoustic performances captured in our signature warm style, featuring raw emotion and stripped-down arrangements",
        duration: "2:58",
        year: "2023",
        url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
        title: "Studio Recording",
        description: "Behind the scenes of our latest album production",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop",
        title: "Live Performance",
        description: "Capturing the energy of our sold-out concert series",
        url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      },
    ],
    playlistUrl:
      "https://youtube.com/playlist?list=PLrAl6rYAS4APYPBhU9y82gkDBuOW_fBzM",
  },
  films: {
    videos: [
      {
        id: "YQHsXMglC9A", // Adele - Hello
        title: "The Last Journey",
        description:
          "A cinematic masterpiece exploring human connection in a digital world, featuring breathtaking visuals and compelling storytelling",
        duration: "12:30",
        year: "2024",
        url: "https://www.youtube.com/watch?v=YQHsXMglC9A",
      },
      {
        id: "fJ9rUzIMcZQ", // Queen - Bohemian Rhapsody
        title: "Neon Dreams",
        description:
          "Cyberpunk thriller with stunning visual effects and compelling narrative that pushes the boundaries of independent filmmaking",
        duration: "8:45",
        year: "2024",
        url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
      },
      {
        id: "L_jWHffIx5E", // Smash Mouth - All Star
        title: "Silent Echoes",
        description:
          "Award-winning short film about memory and loss, exploring themes of nostalgia and human connection through innovative cinematography",
        duration: "6:20",
        year: "2023",
        url: "https://www.youtube.com/watch?v=L_jWHffIx5E",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1489599735188-900b0754df1b?w=800&h=600&fit=crop",
        title: "Film Production",
        description: "On-set moments from our latest feature film",
        url: "https://www.youtube.com/watch?v=YQHsXMglC9A",
      },
      {
        src: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=800&h=600&fit=crop",
        title: "Director's Vision",
        description: "Creative direction and cinematography showcase",
        url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
      },
    ],
    playlistUrl:
      "https://youtube.com/playlist?list=PLrAl6rYAS4APYPBhU9y82gkDBuOW_fBzM",
  },
  commercial: {
    videos: [
      {
        id: "hT_nvWreIhg", // Alan Walker - Faded
        title: "Brand Revolution",
        description:
          "High-impact commercial campaign that redefined modern advertising with innovative storytelling and visual excellence",
        duration: "1:30",
        year: "2024",
        url: "https://www.youtube.com/watch?v=hT_nvWreIhg",
      },
      {
        id: "JGwWNGJdvx8", // Ed Sheeran - Shape of You
        title: "Tech Launch",
        description:
          "Product launch video featuring cutting-edge visual storytelling and dynamic presentation of breakthrough technology",
        duration: "2:15",
        year: "2024",
        url: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
      },
      {
        id: "CevxZvSJLk8", // Katy Perry - Roar
        title: "Lifestyle Campaign",
        description:
          "Emotional brand story connecting products with human experiences, showcasing authentic moments and genuine connections",
        duration: "1:45",
        year: "2023",
        url: "https://www.youtube.com/watch?v=CevxZvSJLk8",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&h=600&fit=crop",
        title: "Commercial Set",
        description: "Behind-the-scenes from our award-winning ad campaigns",
        url: "https://www.youtube.com/watch?v=hT_nvWreIhg",
      },
      {
        src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
        title: "Creative Direction",
        description: "Conceptual development and brand storytelling",
        url: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
      },
    ],
    playlistUrl:
      "https://youtube.com/playlist?list=PLrAl6rYAS4APYPBhU9y82gkDBuOW_fBzM",
  },
};

const NetflixPortfolio = () => {
  const [currentVideos, setCurrentVideos] = useState({
    music: 0,
    films: 0,
    commercial: 0,
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Auto-rotate videos for each section
  useEffect(() => {
    if (!isPlaying) return;

    const intervals = Object.keys(portfolioData).map((section) =>
      setInterval(() => {
        setCurrentVideos((prev) => ({
          ...prev,
          [section]: (prev[section] + 1) % portfolioData[section].videos.length,
        }));
      }, 7000 + Math.random() * 2000)
    );

    return () => intervals.forEach(clearInterval);
  }, [isPlaying]);

  const VideoPlayer = ({ video, sectionKey, isActive, onClick }) => (
    <div
      className={`absolute inset-0 transition-all duration-1000 ${
        isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"
      }`}
    >
      <iframe
        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
        className="w-full h-full object-cover"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title={video.title}
      />

      {/* Click overlay for redirection */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => window.open(video.url, "_blank")}
      />

      {/* Video Info - Bottom Overlay - Responsive */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 xs:p-3 sm:p-4 lg:p-6">
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-1 mb-1 xs:mb-5 sm:mb-3">
          <span className="bg-red-600 px-1 xs:px-1.5 sm:px-2 py-0.5 xs:py-0.5 sm:py-1 text-[10px] xs:text-xs font-bold rounded">
            HD
          </span>
          <span className="text-gray-300 text-[10px] xs:text-xs sm:text-sm">
            {video.year}
          </span>
          <span className="text-gray-300 text-[10px] xs:text-xs sm:text-sm">
            {video.duration}
          </span>
        </div>
        <h4 className="text-sm xs:text-base sm:text-lg lg:text-xl font-bold mb-1 xs:mb-1 sm:mb-2 line-clamp-1 xs:line-clamp-none">
          {video.title}
        </h4>
        <p className="text-gray-300 text-[10px] xs:text-xs sm:text-sm leading-relaxed mb-2 xs:mb-2 sm:mb-4 line-clamp-2 xs:line-clamp-2 sm:line-clamp-3">
          {video.description}
        </p>
        <div className="flex items-center gap-1 xs:gap-2 sm:gap-3">
          <button
            className="bg-white text-black px-2 xs:px-3 sm:px-4 lg:px-6 py-1 xs:py-1.5 sm:py-2 rounded flex items-center gap-1 xs:gap-1 sm:gap-2 text-[10px] xs:text-xs sm:text-sm font-semibold hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              window.open(video.url, "_blank");
            }}
          >
            <svg
              className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8 5v10l8-5-8-5z" />
            </svg>
            Play
          </button>
          <button className="bg-gray-800/80 text-white p-1 xs:p-1.5 sm:p-2 rounded-full hover:bg-gray-700 transition-colors">
            <svg
              className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
          <button className="bg-gray-800/80 text-white p-1 xs:p-1.5 sm:p-2 rounded-full hover:bg-gray-700 transition-colors">
            <svg
              className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.20-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const ImageCard = ({ image, index, sectionKey }) => (
    <div
      className="group relative aspect-[4/3] xs:aspect-[4/2.5] sm:aspect-[4/2] rounded xs:rounded-md sm:rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
      onMouseEnter={() => setHoveredItem(`${sectionKey}-img-${index}`)}
      onMouseLeave={() => setHoveredItem(null)}
      onClick={() => window.open(image.url, "_blank")}
    >
      <img
        src={image.src}
        alt={image.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Always visible title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-1.5 xs:p-2 sm:p-3 lg:p-4">
        <h5 className="font-bold text-white text-[10px] xs:text-xs sm:text-sm lg:text-base mb-0.5 xs:mb-1 line-clamp-1">
          {image.title}
        </h5>
        <p className="text-gray-300 text-[9px] xs:text-[10px] sm:text-xs line-clamp-1 xs:line-clamp-1 sm:line-clamp-2">
          {image.description}
        </p>
      </div>

      {/* Hover overlay for desktop */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${
          hoveredItem === `${sectionKey}-img-${index}`
            ? "opacity-100"
            : "opacity-0 sm:opacity-0"
        }`}
      >
        <div className="absolute bottom-0 left-0 right-0 p-2 xs:p-3 sm:p-4">
          <h5 className="font-bold text-white mb-1 text-xs xs:text-sm sm:text-base">
            {image.title}
          </h5>
          <p className="text-gray-300 text-[10px] xs:text-xs sm:text-sm line-clamp-2">
            {image.description}
          </p>
          <div className="flex items-center gap-1 xs:gap-2 mt-2 xs:mt-2 sm:mt-3">
            <button className="bg-white/20 hover:bg-white/30 text-white p-1 xs:p-1 sm:p-1.5 rounded-full transition-colors">
              <svg
                className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 5v10l8-5-8-5z" />
              </svg>
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white p-1 xs:p-1 sm:p-1.5 rounded-full transition-colors">
              <svg
                className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-0.5 xs:-inset-0.5 sm:-inset-1 bg-gradient-to-r from-red-500/20 to-red-700/20 rounded xs:rounded-md sm:rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm sm:blur-lg" />
    </div>
  );

  const renderSection = (sectionKey, sectionTitle) => {
    const data = portfolioData[sectionKey];
    const currentVideo = currentVideos[sectionKey];

    return (
      <div className="mb-8 xs:mb-12 sm:mb-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 xs:mb-4 sm:mb-6">
          <h3 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 xs:gap-2 sm:gap-3">
            <span className="w-0.5 xs:w-1 h-5 xs:h-6 sm:h-8 bg-red-600 rounded-full"></span>
            {sectionTitle}
          </h3>
          <a
            href={data.playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors text-[10px] xs:text-xs sm:text-sm font-medium"
          >
            View All →
          </a>
        </div>

        {/* Content Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 xs:gap-4 sm:gap-8 lg:gap-8">
          {/* Featured Video Player */}
          <div className="lg:col-span-3 relative rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden bg-gray-900 group cursor-pointer shadow-2xl aspect-video">
            {data.videos.map((video, index) => (
              <VideoPlayer
                key={index}
                video={video}
                sectionKey={sectionKey}
                isActive={index === currentVideo}
                onClick={() => window.open(video.url, "_blank")}
              />
            ))}

            {/* Video Navigation */}
            <div className="absolute top-2 xs:top-2 sm:top-4.5 right-1.5 xs:right-2 sm:right-4 flex gap-1 xs:gap-1 sm:gap-1 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10">
              {data.videos.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentVideos((prev) => ({
                      ...prev,
                      [sectionKey]: index,
                    }));
                  }}
                  className={`w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                    index === currentVideo
                      ? "bg-red-600 scale-125"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            {/* Play/Pause Control */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="absolute top-1.5 xs:top-2 sm:top-4 left-1.5 xs:left-2 sm:left-4 bg-black/50 hover:bg-black/70 text-white p-1 xs:p-1.5 sm:p-2 rounded-full opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 z-10"
            >
              {isPlaying ? (
                <svg
                  className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
                </svg>
              ) : (
                <svg
                  className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 5v10l8-5-8-5z" />
                </svg>
              )}
            </button>
          </div>

          {/* Image Gallery */}
          <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
            {data.images.map((image, index) => (
              <ImageCard
                key={index}
                image={image}
                index={index}
                sectionKey={sectionKey}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Netflix-style gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b pointer-events-none" />

      <div className="relative z-10 px-2 xs:px-3 sm:px-4 md:px-8 lg:px-16 py-4 xs:py-6 sm:py-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 xs:mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 xs:gap-2 mb-3 xs:mb-4 sm:mb-6">
            <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-pulse" />
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-3 xs:mb-4 sm:mb-6">
            <span className="text-white">OUR</span>{" "}
            
            <span className="text-white">WORK</span>
          </h1>
          <p className="text-gray-300 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed px-2 xs:px-4">
            Discover our portfolio of exceptional content across music, film,
            and commercial productions. Each piece tells a unique story crafted
            with passion and precision.
          </p>
        </div>

        {/* Portfolio Sections */}
        <div className="max-w-18xl mx-h-8xl space-y-8 xs:space-y-10 sm:space-y-12 lg:space-y-16">
          {renderSection("music", "Music Videos")}
          {renderSection("films", "Film Productions")}
          {renderSection("commercial", "Commercial Work")}
        </div>
      </div>
    </div>
  );
};

export default NetflixPortfolio;
