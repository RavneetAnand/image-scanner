"use client";

import React, { useEffect, useState } from "react";
import { PredictionModal } from "./PredictionModal";
import { fileName, imagePath } from "@/utils/constants";

export type ImageInfo = {
  filename: string;
  size: number; // Size in bytes
  uploadTime: Date;
};

const ImagesTab: React.FC = () => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [currentImage, setCurrentImage] = useState<ImageInfo | null>(null);

  useEffect(() => {
    // Fetch images from the server or backend
    const fetchImages = async () => {
      try {
        const response = await fetch(imagePath);

        if (response.ok) {
          const lastModified = response.headers.get("Last-Modified");
          const blob = await response.blob();
          const fileSize = blob.size;
          const file = fileName;

          const uploadTime = new Date(lastModified || Date.now());
          const imageInfo: ImageInfo = {
            filename: file,
            size: fileSize,
            uploadTime,
          };

          setImages([imageInfo]);
        }
      } catch (error) {
        throw new Error(`Failed to fetch images: ${(error as Error).message}`);
      }
    };

    fetchImages();
  }, []);

  const handlePredictClick = (image: ImageInfo) => {
    const modal = document?.getElementById(
      "submit-prediction-modal"
    ) as HTMLDialogElement | null;
    modal?.showModal();

    setCurrentImage(image);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-blue-200">
          <tr>
            <th>Filename</th>
            <th>Size</th>
            <th>Time of Upload</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image, index) => (
            <tr key={index}>
              <td>{image.filename}</td>
              <td>{(image.size / 1024).toFixed(2)} KB</td>
              <td>{image.uploadTime.toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handlePredictClick(image)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold mt-1 mb-1 py-0.5 px-2 rounded"
                >
                  PREDICT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {<PredictionModal currentImage={currentImage} />}
    </div>
  );
};

export default ImagesTab;
