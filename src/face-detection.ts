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

  const detections = await faceapi.tinyFaceDetector(img as any, faceDetectionOptions);

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

// Decodes image using tfjs-node so we don't need external dependencies.
// The function extracted from vladmandic/face-api's demo example.
// Source: https://github.com/vladmandic/face-api/blob/eb5501c6728f0690fa7306bc350aafffbc6ae7fe/demo/node.js#L34:L47
function loadImage(content: Buffer) {
  return faceapi.tf.tidy(() => {
     // @ts-ignore
    const decode = faceapi.tf.node.decodeImage(content, 3);

    let expand;
    if (decode.shape[2] === 4) {
      // @ts-ignore
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

    return faceapi.tf.cast(expand, "float32");
  });
}
