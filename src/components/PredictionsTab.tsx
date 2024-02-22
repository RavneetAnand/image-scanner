"use client";

import { useImageInfo } from "@/context/ImageInfoContext";
import React, { useEffect, useState } from "react";

type Prediction = {
  title: string;
  description: string;
  timestamp: string;
};

const PredictionsTab: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const { imagesInfo } = useImageInfo();

  useEffect(() => {
    // Fetch predictions from the JSON server or backend
    const fetchPredictions = async () => {
      try {
        const response = await fetch("http://localhost:3000/predict");
        if (response.ok) {
          const data = await response.json();
        }
      } catch (error) {
        console.error("Failed to fetch predictions:", error);
      }
    };

    fetchPredictions();
  }, []);

  useEffect(() => {
    setPredictions(() => {
      return imagesInfo.map(({ title, description, timestamp }) => {
        return {
          title,
          description,
          timestamp,
        };
      });
    });
  }, [imagesInfo]);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-blue-200">
          <tr className="border-b border-gray-600">
            <th>Title</th>
            <th>Description</th>
            <th>Timestamp</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((prediction, index) => (
            <tr key={index}>
              <td>{prediction.title}</td>
              <td>{prediction.description}</td>
              <td>{new Date(prediction.timestamp).toLocaleString()}</td>
              <td>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold mt-1 mb-1 py-0.5 px-2 rounded"
                  onClick={() =>
                    alert(`Viewing prediction: ${prediction.title}`)
                  }
                >
                  VIEW
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PredictionsTab;
