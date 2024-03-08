"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

export type ImageInfo = {
  filename: string;
  path: string;
  type: string;
  birthDate: string;
  expiryDate: string;
};

const ImagesTab: React.FC = () => {
  const [images, setImages] = useState<ImageInfo[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Add only image files
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setImages((prevImages) => [
        ...prevImages,
        {
          filename: file.name,
          path: URL.createObjectURL(file),
          type: file.type,
          birthDate: "23/12/1990",
          expiryDate: "24/12/2020",
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="flex justify-between my-8">
        <div className="flex items-center border-2 rounded">
          <input type="text" className="px-4 py-1 w-80" placeholder="Search" />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          onClick={handleAddButtonClick}
        >
          + Add
        </button>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="table">
          <thead className="bg-blue-200">
            <tr>
              <th>Passport</th>
              <th>Expiry Date</th>
              <th>Birth Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {images.map((image, index) => (
              <tr key={index}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <Image src={image.path} alt="Avatar passport image" width={2} height={2} />
                      </div>
                    </div>
                    <div>
                      <div>{image.filename}</div>
                    </div>
                  </div>
                </td>
                <td>{image.expiryDate}</td>
                <td>{image.birthDate}</td>
                <td>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Scan Passport
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImagesTab;
