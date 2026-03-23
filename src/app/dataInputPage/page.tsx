"use client";

import React from "react";
import Ampoule from "./Ampoule";

const AmpouleTimelinePage: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i + 1);
  const currentHour = new Date().getHours(); // demo logic

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "center",
        padding: 20,
      }}
    >
      {hours.map((hour) => (
        <Ampoule
          key={hour}
          hour={hour}
          unlocked={hour <= currentHour}
          maxValue={15000}
        />
      ))}
    </div>
  );
};

export default AmpouleTimelinePage;
