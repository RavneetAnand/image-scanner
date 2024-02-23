import React from "react";
import { render, screen } from "@testing-library/react";
import PredictionOverlay from "./PredictionOverlay";
import "@testing-library/jest-dom";

describe("PredictionOverlay", () => {
  const mockPrediction = {
    label: "Test Label",
    score: 0.9,
    bbox: {
      x1: 10,
      y1: 20,
      x2: 30,
      y2: 40,
    },
  };

  const mockImageElement = document.createElement("img");
  // Mock the getBoundingClientRect method
  mockImageElement.getBoundingClientRect = jest.fn(() => ({
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
    x: 0,
    y: 0,
    toJSON: () => {},
  }));

  it("renders without crashing", () => {
    render(
      <PredictionOverlay
        prediction={mockPrediction}
        imageElement={mockImageElement}
      />
    );
  });

  it("displays the correct prediction label", () => {
    render(
      <PredictionOverlay
        prediction={mockPrediction}
        imageElement={mockImageElement}
      />
    );
    expect(
      screen.getByText("Test Label", { exact: false })
    ).toBeInTheDocument();
  });

  it("displays the correct prediction score", () => {
    render(
      <PredictionOverlay
        prediction={mockPrediction}
        imageElement={mockImageElement}
      />
    );
    expect(screen.getByText("90%", { exact: false })).toBeInTheDocument();
  });

  it("displays the correct prediction bounding box", () => {
    render(
      <PredictionOverlay
        prediction={mockPrediction}
        imageElement={mockImageElement}
      />
    );

    const overlay = screen.getByTestId("prediction-overlay");

    expect(overlay).toHaveStyle("left: 0.625px");
    expect(overlay).toHaveStyle("top: 1.667px");
    expect(overlay).toHaveStyle("width: 1.250px");
    expect(overlay).toHaveStyle("height: 1.667px");
  });

  it("updates the overlay style on window resize", () => {
    render(
      <PredictionOverlay
        prediction={mockPrediction}
        imageElement={mockImageElement}
      />
    );

    const overlay = screen.getByTestId("prediction-overlay");

    expect(overlay).toHaveStyle("left: 0.625px");
    expect(overlay).toHaveStyle("top: 1.667px");
    expect(overlay).toHaveStyle("width: 1.250px");
    expect(overlay).toHaveStyle("height: 1.667px");

    // Mock the getBoundingClientRect method
    mockImageElement.getBoundingClientRect = jest.fn(() => ({
      width: 200,
      height: 200,
      top: 0,
      left: 0,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    window.dispatchEvent(new Event("resize"));

    expect(overlay).toHaveStyle("left: 0.625px");
    expect(overlay).toHaveStyle("top: 1.667px");
    expect(overlay).toHaveStyle("width: 1.250px");
    expect(overlay).toHaveStyle("height: 1.667px");
  });
});
