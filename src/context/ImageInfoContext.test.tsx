import { act, render, renderHook } from "@testing-library/react";
import { ImageInfoProvider, useImageInfo } from "./ImageInfoContext";

const imageInfo = {
  filename: "test.jpg",
  title: "Test image",
  description: "This is a test image",
  timestamp: "2021-01-01",
};

describe("ImageInfoContext", () => {
  it("should render without crashing", () => {
    render(
      <ImageInfoProvider>
        <div />
      </ImageInfoProvider>
    );
  });

  it("should throw an error when useImageInfo is used outside of ImageInfoProvider", () => {
    try {
      const { result } = renderHook(() => useImageInfo());
      expect(result.current).toBe(undefined);
    } catch (err) {
      expect(err).toEqual(
        Error("useImageInfo must be used within a ImageInfoProvider")
      );
    }
  });

  it("should add an image info to the context", () => {
    const { result } = renderHook(() => useImageInfo(), {
      wrapper: ImageInfoProvider,
    });

    act(() => {
      result.current.addImageInfo(imageInfo);
    });

    expect(result.current.imagesInfo).toContainEqual(imageInfo);
  });

  it("should update existing image info when it exists", () => {
    const { result } = renderHook(() => useImageInfo(), {
      wrapper: ImageInfoProvider,
    });

    act(() => {
      result.current.addImageInfo(imageInfo);
    });

    act(() => {
      result.current.addImageInfo({ ...imageInfo, title: "Updated Title" });
    });

    expect(result.current.imagesInfo).toContainEqual({
      description: "This is a test image",
      filename: "test.jpg",
      timestamp: "2021-01-01",
      title: "Updated Title",
    });
    expect(result.current.imagesInfo).not.toContainEqual(imageInfo);
  });
});
