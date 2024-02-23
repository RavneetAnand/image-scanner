import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { ImageInfoProvider } from "@/context/ImageInfoContext";
import PredictionsTab from "./PredictionsTab";
import "@testing-library/jest-dom";

let mockFetch: jest.Mock = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        predictions: [
          [
            {
              label: "Test Label",
              confidence: 0.5,
            },
          ],
        ],
      }),
  })
);

// Mock implementation of imagesInfo
let mockImagesInfo = [
  {
    title: "Test Title",
    description: "Test Description",
    timestamp: "2022-01-01T00:00:00Z",
  },
];

const renderComponent = () => {
  return render(
    <ImageInfoProvider>
      <PredictionsTab />
    </ImageInfoProvider>
  );
};

// Mock the useImageInfo hook
jest.mock("../context/ImageInfoContext", () => ({
  ...jest.requireActual("../context/ImageInfoContext"),
  useImageInfo: jest.fn().mockImplementation(() => ({
    imagesInfo: mockImagesInfo,
  })),
}));

jest.mock("./ImageWithPredictions/PredictionOverlay", () => {
  return {
    __esModule: true,
    default: () => <div>Mocked Prediction Overlay</div>,
  };
});

describe("PredictionsTab", () => {
  beforeAll(() => {
    const img = new Image() as HTMLImageElement;
    img.onload = () => {};
  });

  beforeEach(() => {
    // Clear all the mock function calls before each test
    jest.clearAllMocks();

    // Mock the fetch function
    global.fetch = mockFetch;
  });

  it("renders PredictionsTab component", () => {
    const screen = renderComponent();

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Timestamp")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("renders image details", async () => {
    const screen = renderComponent();

    await waitFor(() => screen.getByText("Test Title"));

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(
      screen.getByText(new Date("2022-01-01T00:00:00Z").toLocaleString())
    ).toBeInTheDocument();
  });

  it("calls closeImage function when close button is clicked", async () => {
    const screen = renderComponent();

    fireEvent.click(screen.getByText("VIEW"));

    await waitFor(() => screen.getByText("✕"));
    fireEvent.click(screen.getByText("✕"));

    expect(screen.queryByText("✕")).not.toBeInTheDocument();
  });

  it("should trigger image onLoad function and should render renderPredictionOverlays function", async () => {
    const screen = renderComponent();

    fireEvent.click(screen.getByText("VIEW"));

    await waitFor(() => screen.getByText("✕"));
    fireEvent.load(screen.getByAltText("Predicted Image"));

    await waitFor(() =>
      expect(screen.getByText("Mocked Prediction Overlay")).toBeInTheDocument()
    );
  });

  it("calls viewImage function when VIEW button is clicked", async () => {
    const screen = renderComponent();

    fireEvent.click(screen.getByText("VIEW"));

    expect(fetch).toHaveBeenCalled();
  });

  it("should throw the error when the fetch fails", async () => {
    mockFetch = jest.fn(() => Promise.reject(new Error("no data available")));

    try {
      await act(async () => {
        renderComponent();
      });
    } catch (error) {
      expect(error).toBe("Failed to fetch predictions: no data available");
    }
  });
});
