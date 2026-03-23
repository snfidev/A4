"use client";
import React from "react";
import styles from "./LineGraph.module.css";

interface LineGraphProps {
  data?: number[];
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
  const values = data || [12, 18, 15, 20, 22, 19, 25, 23];
  const maxValue = Math.max(...values);

  return (
    <div className={styles.lineGraphContainer}>
      <div className="line-graph-container">
        <svg className="line-graph" xmlns="http://www.w3.org/2000/svg">
          <polyline
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            points={values
              .map(
                (value, i) =>
                  `${(i / (values.length - 1)) * 100}%,${
                    100 - (value / maxValue) * 100
                  }%`,
              )
              .join(" ")}
          />
          {values.map((value, i) => (
            <circle
              key={i}
              cx={`${(i / (values.length - 1)) * 100}%`}
              cy={`${100 - (value / maxValue) * 100}%`}
              r="4"
              fill="#4f46e5"
            />
          ))}
        </svg>
      </div>

      <div className={styles.hoursLabels}>
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i}>{i + 1}h</span>
        ))}
      </div>
    </div>
  );
};

export default LineGraph;
