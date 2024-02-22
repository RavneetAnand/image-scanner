import { useState } from "react";
import { ImageInfo } from "./ImagesTab";
import { useImageInfo } from "@/context/ImageInfoContext";

type PredictionModalProps = {
  currentImage: ImageInfo | null;
};

export const PredictionModal = ({ currentImage }: PredictionModalProps) => {
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

    closeModal();
    setTitle("");
    setDescription("");
  };

  const closeModal = () => {
    const modal = document.getElementById(
      "submit-prediction-modal"
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  return (
    <dialog id="submit-prediction-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Submit Prediction</h3>
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
        />
        <div className="modal-action">
          <form method="dialog">
            <button className="btn mr-2" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn" onClick={submitPrediction}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
