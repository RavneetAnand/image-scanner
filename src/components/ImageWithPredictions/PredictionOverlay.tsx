import React, { useEffect, useState } from "react";

type Prediction = {
  label: string;
  score: number;
  bbox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
};

type PredictionOverlayProps = {
  prediction: Prediction;
  imageElement: HTMLImageElement | null;
};

const PredictionOverlay = ({
  prediction,
  imageElement,
}: PredictionOverlayProps) => {
  const [overlayStyle, setOverlayStyle] = useState({});

  const { label, score, bbox } = prediction;

  const updateOverlayStyle = () => {
    if (imageElement) {
      // Original dimensions of the image used to calculate bbox values
      // These should be replaced with the actual dimensions of the original image
      const originalWidth = 1600;
      const originalHeight = 1200;
      const {
        width,
        height,
        x: left,
        y: top,
      } = imageElement.getBoundingClientRect();

      // Calculate scale factors
      const scaleX = width / originalWidth;
      const scaleY = height / originalHeight;

      const adjustedBboxes = {
        adjustedX1: bbox.x1 * scaleX,
        adjustedY1: bbox.y1 * scaleY,
        adjustedWidth: (bbox.x2 - bbox.x1) * scaleX,
        adjustedHeight: (bbox.y2 - bbox.y1) * scaleY,
      };
      console.log("Resize", adjustedBboxes);
      setOverlayStyle({
        left: `${left + adjustedBboxes.adjustedX1}px`,
        top: `${top + adjustedBboxes.adjustedY1}px`,
        width: `${adjustedBboxes.adjustedWidth}px`,
        height: `${adjustedBboxes.adjustedHeight}px`,
      });
    }
  };

  // Update the overlay style on window resize
  useEffect(() => {
    window.addEventListener("resize", updateOverlayStyle);
    // Call the function once to set the initial overlay style
    updateOverlayStyle();

    return () => {
      window.removeEventListener("resize", updateOverlayStyle);
    };
  }, [prediction]);

  return (
    <div
      className="absolute border-2 border-blue-500 bg-blend-overlay bg-blue-500 bg-opacity-10"
      style={overlayStyle}
    >
      <div className="absolute text-xs bg-transparent text-blue-500 bottom-0 right-0 font-semibold">
        {label} - {`score: ${(score * 100).toFixed(0)}%`}
      </div>
    </div>
  );
};

export default PredictionOverlay;
