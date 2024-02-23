"use client";

import { useImageInfo } from "@/context/ImageInfoContext";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PredictionOverlay from "./ImageWithPredictions/PredictionOverlay";

type ImageDetails = {
  title: string;
  description: string;
  timestamp: string;
};

const PredictionsTab: React.FC = () => {
  const [imagesDetails, setImagesDetails] = useState<ImageDetails[]>([]);
  const [predictions, setPredictions] = useState([]);
  const [imageVisible, setImageVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  const { imagesInfo } = useImageInfo();

  const renderPredictionOverlays = () => {
    if (!imageRef.current) return;

    return predictions.map((prediction, index) => (
      <PredictionOverlay
        key={index}
        prediction={prediction}
        imageElement={imageRef.current}
      />
    ));
  };

  useEffect(() => {
    setImagesDetails(() => {
      return imagesInfo.map(({ title, description, timestamp }) => {
        return {
          title,
          description,
          timestamp,
        };
      });
    });
  }, [imagesInfo]);

  // Fetch predictions from the JSON server or backend
  const fetchPredictions = async () => {
    try {
      const response = await fetch("http://localhost:3000/predict");
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error: any) {
      throw Error(`Failed to fetch predictions: ${error.message}`);
    }
  };

  const viewImage = async () => {
    if (predictions.length === 0) {
      const predictionResults = await fetchPredictions();
      const { predictions: preds } = predictionResults;
      setPredictions(preds);
    }

    // Open the image in a modal
    setImageVisible(true);
  };

  const closeImage = () => {
    setImageVisible(false);
    setImageLoaded(false);
  };

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
          {imagesDetails.map((prediction, index) => (
            <tr key={index}>
              <td>{prediction.title}</td>
              <td>{prediction.description}</td>
              <td>{new Date(prediction.timestamp).toLocaleString()}</td>
              <td>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold mt-1 mb-1 py-0.5 px-2 rounded"
                  onClick={viewImage}
                >
                  VIEW
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {imageVisible && (
        <div className="m-3 p-5 border border-gray-400">
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={closeImage}
          >
            ✕
          </button>
          <Image
            src="/assets/orange.jpg"
            alt="Predicted Image"
            className="w-full h-full max-w-screen-lg mx-auto"
            width={500}
            height={800}
            ref={imageRef}
            onLoad={() => setImageLoaded(true)}
          />
          {imageLoaded && renderPredictionOverlays()}
        </div>
      )}
    </div>
  );
};

export default PredictionsTab;
