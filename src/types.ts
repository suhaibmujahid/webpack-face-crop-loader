import type { ITinyFaceDetectorOptions } from "@vladmandic/face-api";

export type LoaderOptions = {
  height?: number;
  width?: number;
} & ITinyFaceDetectorOptions;
