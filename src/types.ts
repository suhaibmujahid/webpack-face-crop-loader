import type { ITinyFaceDetectorOptions } from "@vladmandic/face-api";

type CropOptions = {
  height?: number;
  width?: number;
  minScale?: number;
};

export type LoaderOptions = CropOptions & ITinyFaceDetectorOptions;
