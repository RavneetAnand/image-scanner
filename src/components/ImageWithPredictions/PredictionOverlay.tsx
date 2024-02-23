import React, { useCallback, useEffect, useRef, useState } from "react";

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
  const throttleInProgress = useRef<boolean>();

  const { label, score, bbox } = prediction;

  const updateOverlayStyle = useCallback(() => {
    if (imageElement) {
      // Original dimensions of the image used to calculate bbox values
      // These should be replaced with the actual dimensions of the original image
      const originalWidth = 1600;
      const originalHeight = 1200;
      const { width, height } = imageElement.getBoundingClientRect();

      // Calculate scale factors
      const scaleX = width / originalWidth;
      const scaleY = height / originalHeight;

      const adjustedBboxes = {
        adjustedX1: bbox.x1 * scaleX,
        adjustedY1: bbox.y1 * scaleY,
        adjustedWidth: (bbox.x2 - bbox.x1) * scaleX,
        adjustedHeight: (bbox.y2 - bbox.y1) * scaleY,
      };

      setOverlayStyle({
        left: `${(imageElement.offsetLeft + adjustedBboxes.adjustedX1).toFixed(
          3
        )}px`,
        top: `${(imageElement.offsetTop + adjustedBboxes.adjustedY1).toFixed(
          3
        )}px`,
        width: `${adjustedBboxes.adjustedWidth.toFixed(3)}px`,
        height: `${adjustedBboxes.adjustedHeight.toFixed(3)}px`,
      });
    }
  }, [imageElement]);

  const handleThrottleResize = () => {
    if (throttleInProgress.current) {
      return;
    }
    throttleInProgress.current = true;

    setTimeout(() => {
      updateOverlayStyle();

      throttleInProgress.current = false;
    }, 500);
  };

  // Update the overlay style on window resize
  useEffect(() => {
    window.addEventListener("resize", handleThrottleResize);
    // Call the function once to set the initial overlay style
    updateOverlayStyle();

    return () => {
      window.removeEventListener("resize", handleThrottleResize);
    };
  }, [prediction]);

  return (
    <div
      data-testid="prediction-overlay"
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
