"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getPassportDetailsUrl } from "@/utils/constants";
import Toast from "./Toast";

const PassportsList: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [data, setData] = useState<{ dateOfBirth: string; dateOfExpiry: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear the error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const getImageReader = (file: File): FileReader => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return reader;
  };

  const handleAddButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Add only image files
      if (!file.type.startsWith("image/")) {
        setError(new Error("Please select an image file"));
        return;
      }

      setImages((prevImages) => [...prevImages, file]);
    }
  };

  const scanPassport = (imageIndex: number) => {
    const image = images[imageIndex];

    // Set header type as per the image type
    const headers = {
      "Content-Type": image.type,
    };

    let params;

    const reader = getImageReader(image);

    setIsLoading(true);

    reader.onload = () => {
      params = reader.result;

      fetch(getPassportDetailsUrl, {
        method: "POST",
        headers,
        body: params,
      })
        .then((res) => res.json())
        .then((resData) =>
          setData((prevData) => {
            // Add the data to the state at the index of the image
            const newData = [...prevData];
            newData[imageIndex] = resData;
            return newData;
          })
        )
        .catch((e) =>
          setError(new Error("We couldn't fetch passport details. Please try uploading a clear image of the passport."))
        )
        .finally(() => setIsLoading(false));
    };
  };

  const passportScanned = (imageIndex: number) => {
    return !!data[imageIndex]?.dateOfBirth || !!data[imageIndex]?.dateOfExpiry;
  };

  const rendertableBody = () => {
    const files = images.map((image) => ({
      filename: image.name,
      path: URL.createObjectURL(image),
      type: image.type,
    }));

    return files.map((image, index) => (
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
        <td>{data[index]?.dateOfExpiry}</td>
        <td>{data[index]?.dateOfBirth}</td>
        <td>
          {
            <button
              className={`${
                passportScanned(index)
                  ? "hidden"
                  : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
              }`}
              onClick={() => scanPassport(index)}
              disabled={passportScanned(index)}
            >
              Scan Passport
            </button>
          }
        </td>
      </tr>
    ));
  };

  return (
    <div className="flex flex-col justify-center w-full">
      {isLoading && <Toast message="Scanning passport..." />}
      {error && <Toast message={error.message} type={"warning"} />}
      <div className="flex justify-between my-8">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          onClick={handleAddButtonClick}
          data-testid="add-button"
        >
          + Add
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          data-testid="upload-input"
        />
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="table" data-testid="images-table">
          <thead className="bg-blue-200">
            <tr>
              <th>Passport</th>
              <th>Expiry Date</th>
              <th>Birth Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rendertableBody()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default PassportsList;
