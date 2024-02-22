import React, { createContext, useContext, useState, ReactNode } from "react";

type ImageInfo = {
  filename: string;
  title: string;
  description: string;
  timestamp: string;
};

type ImageInfoContextType = {
  imagesInfo: ImageInfo[];
  addImageInfo: (newImageInfo: ImageInfo) => void;
};

const ImageInfoContext = createContext<ImageInfoContextType | undefined>(
  undefined
);

export const useImageInfo = () => {
  const context = useContext(ImageInfoContext);
  if (context === undefined) {
    throw new Error("useImageInfo must be used within a ImageInfoProvider");
  }
  return context;
};

export const ImageInfoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [imagesInfo, setImagesInfo] = useState<ImageInfo[]>([]);

  const addImageInfo = (newImageInfo: ImageInfo) => {
    setImagesInfo((prevImages) => {
      // Check if the image info already exists and update it, or add a new entry
      const index = prevImages.findIndex(
        (image) => image.filename === newImageInfo.filename
      );

      if (index > -1) {
        const updatedImages = [...prevImages];
        updatedImages[index] = newImageInfo;
        return updatedImages;
      }

      return [...prevImages, newImageInfo];
    });
  };

  return (
    <ImageInfoContext.Provider value={{ imagesInfo, addImageInfo }}>
      {children}
    </ImageInfoContext.Provider>
  );
};
