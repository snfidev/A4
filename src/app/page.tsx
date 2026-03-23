"use client";

import React, { useState } from "react";
import BallBox from "./mainPageComponents/BallBox";
import LineGraph from "./mainPageComponents/LineGraph";

export default function Page() {
  // Only keep page-specific state
  const [goodCount, setGoodCount] = useState(0);
  const [badCount, setBadCount] = useState(0);

  const [items, setItems] = useState(0);
  const [drops, setDrops] = useState(0);

  const addItem = () => {
    setItems((prev) => {
      const next = prev + 1;
      if (next % 100 === 0) setDrops((d) => d + 1);
      return next;
    });
  };

  const addGood = () => {
    addItem();
    setGoodCount((prev) => prev + 1);
  };

  const addBad = () => {
    addItem();
    setBadCount((prev) => prev + 1);
  };

  return (
    <>
      {/* TOP SECTION */}
      <div className="top">
        <div className="box">
          <BallBox trigger={goodCount} color="green" />
        </div>
        <div className="box">
          <BallBox trigger={badCount} color="red" />
        </div>
      </div>

      {/* ACTION BUTTONS (optional, since sidebar had them before) */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={addGood}>+ Good</button>
        <button onClick={addBad}>+ Bad</button>
      </div>

      {/* BOTTOM GRAPH */}
      <div className="bottom">
        <div className="linegraph-wrapper">
          <LineGraph />
        </div>
      </div>
    </>
  );
}
