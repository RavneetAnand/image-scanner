import React, { useEffect, useState } from "react";
import { PredictionModal } from "./PredictionModal";

export type ImageInfo = {
  filename: string;
  size: number; // Size in bytes
  uploadTime: Date;
};

const ImagesTab: React.FC = () => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<ImageInfo | null>(null);

  useEffect(() => {
    // Fetch images from the server or backend
    const fetchImages = async () => {
      try {
        const response = await fetch("/assets/orange.jpg");

        if (response.ok) {
          const lastModified = response.headers.get("Last-Modified");
          const blob = await response.blob();
          const fileSize = blob.size;
          const fileName = "orange.jpg";

          const uploadTime = new Date(lastModified || Date.now());
          const imageInfo: ImageInfo = {
            filename: fileName,
            size: fileSize,
            uploadTime,
          };

          setImages([imageInfo]);
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };

    fetchImages();
  }, []);

  const handlePredictClick = (image: ImageInfo) => {
    setCurrentImage(image);
    setIsModalOpen(true);
  };

  return (
    <div className="p-5 border-t border-gray-400 ">
      <div className="overflow-x-auto mt-3 shadow-md border border-gray-400">
        <table className="w-full text-left bg-blue-50">
          <thead className="bg-blue-200">
            <tr className="border-b border-gray-600">
              <th>Filename</th>
              <th>Size</th>
              <th>Time of Upload</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image, index) => (
              <tr key={index} className="border-b border-gray-500">
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
      </div>
      {isModalOpen && (
        <PredictionModal
          currentImage={currentImage}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default ImagesTab;
