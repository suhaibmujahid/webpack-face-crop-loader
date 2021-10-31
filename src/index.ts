import type { LoaderContext } from "webpack";
import { validate } from "schema-utils";
import { LoaderOptions } from "./types";
import schema from "./options.json";
import sharp from "sharp";
import smartcrop from "smartcrop-sharp";
import FaceDetection from "./face-detection";
import type { Schema } from "schema-utils/declarations/validate";

export const raw = true;

export default async function loader(
  this: LoaderContext<LoaderOptions>,
  contentBuffer: Buffer
): Promise<Buffer> {
  const options = this.getOptions();

  validate(schema as Schema, options, {
    name: "Face Crop Loader",
    baseDataPath: "options",
  });

  const {
    width = 400,
    height = 400,
    minScale = 1,
    ...detectionOptions
  } = options;

  const faces = await FaceDetection(contentBuffer, detectionOptions);
  const { topCrop } = await smartcrop.crop(contentBuffer, {
    width,
    height,
    minScale,
    boost: faces,
  });

  return await sharp(contentBuffer)
    .extract({
      width: topCrop.width,
      height: topCrop.height,
      left: topCrop.x,
      top: topCrop.y,
    })
    .resize(width, height)
    .toBuffer();
}
