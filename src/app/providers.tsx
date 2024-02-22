"use client";

import { ImageInfoProvider } from "@/context/ImageInfoContext";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ImageInfoProvider>{children}</ImageInfoProvider>;
}
