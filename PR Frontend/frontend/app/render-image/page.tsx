"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RenderImage() {
  const searchParams = useSearchParams();
  const base64Param = searchParams.get("image");

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {imageSrc ? (
        <img
          src={`data:image/png;base64,${base64Param}`}
          alt="Rendered from base64"
          className="max-w-full max-h-screen"
        />
      ) : (
        <div>Loading image...</div>
      )}
    </div>
  );
}
