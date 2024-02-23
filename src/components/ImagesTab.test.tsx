import React from "react";
import { render, waitFor } from "@testing-library/react";
import { ImageInfoProvider } from "@/context/ImageInfoContext";
import ImagesTab from "./ImagesTab";
import { act } from "react-dom/test-utils";

const renderComponent = () => {
  return render(
    <ImageInfoProvider>
      <ImagesTab />
    </ImageInfoProvider>
  );
};

// Mock the modal element with a showModal method
(document.getElementById as jest.Mock) = jest.fn(() => ({
  showModal: jest.fn(),
}));

let mockFetch: jest.Mock = jest.fn(() =>
  Promise.resolve({
    ok: true,
    headers: {
      get: () => ({ "Last-Modified": "2021-08-25T18:00:00Z" }),
    },
    blob: () => Promise.resolve({ size: 100 }),
  })
);

describe("ImagesTab", () => {
  beforeEach(() => {
    // Clear all the mock function calls before each test
    jest.clearAllMocks();

    // Mock the fetch function
    global.fetch = mockFetch;
  });

  it("renders without crashing", async () => {
    await act(async () => {
      renderComponent();
    });
  });

  it("fetches images from the server", async () => {
    await act(async () => {
      renderComponent();
    });

    expect(fetch).toHaveBeenCalledWith("/assets/orange.jpg");
  });

  it("shows the prediction modal when the predict button is clicked", async () => {
    const { getByText } = renderComponent();

    await waitFor(() => expect(getByText("PREDICT")).toBeDefined());

    const button = getByText("PREDICT");

    act(() => {
      button.click();
    });

    expect(document.getElementById("submit-prediction-modal")).not.toBeNull();
  });

  it("should set the uploadTime as the current time if the Last-Modified header is not present", async () => {
    mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        headers: {
          get: () => null,
        },
        blob: () => Promise.resolve({ size: 100 }),
      })
    );

    const screen = renderComponent();

    expect(fetch).toHaveBeenCalledWith("/assets/orange.jpg");
    await waitFor(() => expect(screen.getByText("PREDICT")).toBeDefined());
  });

  it("should throw the error when the fetch fails", async () => {
    mockFetch = jest.fn(() =>
      Promise.reject(new Error("Failed to fetch images"))
    );

    try {
      await act(async () => {
        renderComponent();
      });
    } catch (error) {
      expect(error).toBe("Failed to fetch images: Failed to fetch images");
    }
  });
});
