import { useState } from "react";
import { ImageInfo } from "./ImagesTab";
import { useImageInfo } from "@/context/ImageInfoContext";

type PredictionModalProps = {
  setIsModalOpen: (isOpen: boolean) => void;
  currentImage: ImageInfo | null;
};

export const PredictionModal = ({
  setIsModalOpen,
  currentImage,
}: PredictionModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { addImageInfo } = useImageInfo();

  const submitPrediction = async () => {
    if (currentImage && title && description) {
      const predictionData = {
        imageId: currentImage.filename,
        title,
        description,
      };

      try {
        /* const response = await fetch('http://localhost:3000/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData),
      }); */

        // Assuming the API returns a valid JSON response
        const response = { ok: true };

        if (response.ok) {
          // Add logic to update the Predictions tab here
          alert("Prediction submitted successfully!");
        } else {
          alert("Failed to submit prediction.");
        }
      } catch (error) {
        console.error("Error submitting prediction:", error);
        alert("Error submitting prediction.");
      }
    }

    addImageInfo({
      filename: currentImage?.filename || "",
      title: title,
      description: description,
      timestamp: new Date().toISOString(),
    });

    setIsModalOpen(false);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto ">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-5 rounded-lg shadow-xl border border-gray-500">
          <h2 className="text-lg font-semibold">Submit Prediction</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full max-w-xs mt-5 mb-5 p-2 border border-gray-800 rounded text-sm"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full max-w-xs mt-5 mb-5 p-2 border border-gray-800 rounded text-sm"
          ></textarea>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn bg-black text-white font-semibold px-1 py-1 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={submitPrediction}
              className="btn btn-primary bg-black text-white font-semibold px-1 py-1 rounded-md"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
