import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { PredictionModal } from "./PredictionModal";
import { ImageInfoProvider } from "@/context/ImageInfoContext";

// Mock the modal element with a close method
const mockCloseMethod = jest.fn();
(document.getElementById as jest.Mock) = jest.fn(() => ({
  close: mockCloseMethod,
}));

// Mock implementation of addImageInfo
let mockAddImageInfo = jest.fn();

// Mock the useImageInfo hook
jest.mock("../context/ImageInfoContext", () => ({
  ...jest.requireActual("../context/ImageInfoContext"),
  useImageInfo: jest.fn().mockImplementation(() => ({
    imagesInfo: [],
    addImageInfo: mockAddImageInfo,
  })),
}));

const mockCurrentImage = {
  filename: "test.jpg",
  size: 277,
  uploadTime: new Date(),
};

const renderComponent = () => {
  return render(
    <ImageInfoProvider>
      <PredictionModal currentImage={mockCurrentImage} />
    </ImageInfoProvider>
  );
};

describe("PredictionModal", () => {
  beforeEach(() => {
    // Clear all the mock function calls before each test
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderComponent();
  });

  it("updates the state when the input fields change", () => {
    const { getByPlaceholderText } = renderComponent();

    const titleInput = getByPlaceholderText("Title") as HTMLInputElement;
    const descriptionInput = getByPlaceholderText(
      "Description"
    ) as HTMLInputElement;

    fireEvent.change(titleInput, {
      target: { value: "New Title" },
    });
    fireEvent.change(descriptionInput, {
      target: { value: "New Description" },
    });

    expect(titleInput.value).toBe("New Title");
    expect(descriptionInput.value).toBe("New Description");
  });

  it("calls addImageInfo with the correct arguments when the submit button is clicked", () => {
    const { getByText, getByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText("Title"), {
      target: { value: "New Title" },
    });
    fireEvent.change(getByPlaceholderText("Description"), {
      target: { value: "New Description" },
    });

    fireEvent.click(getByText("Submit"));

    expect(mockAddImageInfo).toHaveBeenCalledWith({
      filename: mockCurrentImage.filename,
      title: "New Title",
      description: "New Description",
      timestamp: expect.any(String),
    });
  });

  it("closes the modal when the cancel button is clicked", () => {
    const { getByText } = renderComponent();

    fireEvent.click(getByText("Cancel"));

    expect(mockCloseMethod).toHaveBeenCalledTimes(1);
  });
});
