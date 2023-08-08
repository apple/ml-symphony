// For licensing see accompanying LICENSE file.
// Copyright (C) 2023 Apple Inc. All Rights Reserved.

import html2canvas from "html2canvas";

export function exportView(container: HTMLDivElement, name: string) {
  html2canvas(container).then((canvas: HTMLCanvasElement) => {
    const a = document.createElement("a");
    a.href = canvas
      .toDataURL("image/jpeg")
      .replace("image/jpeg", "image/octet-stream");
    a.download = `${name}.jpg`;
    a.click();
  });
}
