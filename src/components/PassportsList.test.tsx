import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";

import PassportsList from "./PassportsList";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

const renderComponent = () => {
  return render(<PassportsList />);
};

// Mock the modal element with a showModal method
(document.getElementById as jest.Mock) = jest.fn(() => ({
  showModal: jest.fn(),
}));

let mockFetch: jest.Mock = jest.fn(() =>
  Promise.resolve({
    ok: true,
    headers: {
      post: () => {},
    },
  })
);

describe("PassportsList", () => {
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

  it("should throw the error when the fetch fails", async () => {
    mockFetch = jest.fn(() => Promise.reject(new Error("Failed to fetch images")));

    try {
      await act(async () => {
        renderComponent();
      });
    } catch (error) {
      expect(error).toBe("Failed to fetch images: Failed to fetch images");
    }
  });

  it("should show an alert when non-image file is uploaded", async () => {
    // Mock URL.createObjectURL
    const createObjectURLMock = jest.fn().mockReturnValue("http://localhost:3000");
    URL.createObjectURL = createObjectURLMock;

    //Mock alert
    global.alert = jest.fn();

    const file = new File(["hello"], "hello.png", { type: "application/json" });
    const { getByTestId } = renderComponent();

    const addButton = getByTestId("add-button");

    act(() => {
      addButton.click();
    });

    const input = getByTestId("upload-input");

    act(() => {
      fireEvent.change(input, {
        target: { files: [file] },
      });
    });

    expect(alert).toHaveBeenCalledWith("Please select an image file");
  });

  it("should render the table when an image file is uploaded", async () => {
    // Mock URL.createObjectURL
    const createObjectURLMock = jest.fn().mockReturnValue("http://localhost:3000");
    URL.createObjectURL = createObjectURLMock;

    const file = new File(["hello"], "hello.png", { type: "image/png" });

    const { getByTestId, getByText } = renderComponent();

    const addButton = getByTestId("add-button");
    act(() => {
      addButton.click();
    });

    const input = getByTestId("upload-input");
    act(() => {
      fireEvent.change(input, {
        target: { files: [file] },
      });
    });

    expect(createObjectURLMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(getByTestId("images-table")).toBeInTheDocument();
      expect(getByText("hello.png")).toBeInTheDocument();
    });
  });
});
