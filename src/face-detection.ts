import path from "path";
import { memoize } from "lodash";
import * as faceapi from "@vladmandic/face-api";
import type { ITinyFaceDetectorOptions } from "@vladmandic/face-api";

const loadModel = memoize(() =>
  faceapi.nets.tinyFaceDetector.loadFromDisk(
    path.resolve(__dirname, "../models")
  )
);

export default async function FaceDetectionFaceAPI(
  content: Buffer,
  options: ITinyFaceDetectorOptions
) {
  const faceDetectionOptions = new faceapi.TinyFaceDetectorOptions({
    inputSize: options.inputSize || 128,
    scoreThreshold: options.scoreThreshold || 0.5,
  });

  await loadModel();
  const img = await loadImage(content);

  const detections = await faceapi.tinyFaceDetector(img, faceDetectionOptions);

  const faces = detections.map(function ({ box }) {
    return {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      weight: 1.0,
    };
  });

  return faces;
}

async function loadImage(content: Buffer) {
  const tensor = await faceapi.tf.tidy(() => {
    const decode = faceapi.tf.node.decodeImage(content, 3);
    let expand;
    if (decode.shape[2] === 4) {
      const channels = faceapi.tf.split(decode, 4, 2);
      const rgb = faceapi.tf.stack([channels[0], channels[1], channels[2]], 2);
      expand = faceapi.tf.reshape(rgb, [
        1,
        decode.shape[0],
        decode.shape[1],
        3,
      ]);
    } else {
      expand = faceapi.tf.expandDims(decode, 0);
    }
    const cast = faceapi.tf.cast(expand, "float32");
    return cast;
  });

  return tensor;
}
