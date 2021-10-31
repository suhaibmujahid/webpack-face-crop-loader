<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

# webpack-face-crop-loader

## Getting Started

To begin, you'll need to install `webpack-face-crop-loader`:

```console
$ npm install webpack-face-crop-loader --save-dev
```

Then add the loader to your `webpack` config. For example:

**file.js**

```js
import profile from "./pictures_dir/profile.jpg";
```

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        include: [path.resolve(__dirname, "pictures_dir")],
        use: [
          {
            loader: "webpack-face-crop-loader",
            options: { ...options },
          },
        ],
      },
    ],
  },
};
```

And run `webpack` via your preferred method.

## Options

### `height`

Type: `number`
Default: `400`

The height of the output image.

### `width`

Type: `number`
Default: `400`

The width of the output image.

### `minScale`

Type: `number`
Default: `1`

The minimal scale of the crop rect, set to `1` to prevent smaller than necessary crops. Lower than `1` will zoom in if needed (more risk of chopping things off).

### `inputSize`

Type: `number`
Default: `128`

The size of the image when it is passed to be processed by the face detection model.
The smaller the faster, but less precise in detecting small faces.

Must be divisible by `32`, common sizes are: `128`, `160`, `224`, `320`, `416`, `512`, and `608`.

### `scoreThreshold`

Type: `number`
Default: `0.5`

Minimum confidence threshold for the face detection model.

## Credits

- [smartcrop.js](https://github.com/jwagner/smartcrop.js)
- [face-api.js](https://github.com/justadudewhohacks/face-api.js) and the maintained fork [vladmandic/face-api](https://github.com/vladmandic/face-api)

## License

[MIT](./LICENSE)
