import React from "react";

const OurLittleFacts = () => {
  const facts = [
    {
      id: 1,
      number: "100+",
      label: "Lorem ipsum",
    },
    {
      id: 2,
      number: "100+",
      label: "Lorem ipsum",
    },
    {
      id: 3,
      number: "100+",
      label: "Lorem ipsum",
    },
  ];

  return (
    <section className="bg-black text-white w-30px py-30 px-7 md:px-16 lg:px-34">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
        Our Little Facts
      </h2>

      {/* Facts Row */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 max-w-6xl mx-auto">
        {facts.map((fact) => (
          <div
            key={fact.id}
            className="flex flex-col items-center justify-center border border-gray-400 px-12 py-10 sm:px-16 sm:py-20 text-center"
          >
            {/* Number */}
            <h3 className="text-5xl font-bold text-red-500">{fact.number}</h3>

            {/* Label */}
            <p className="text-sm mt-2">{fact.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurLittleFacts;
