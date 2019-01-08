# screenshot-maker

Generate App Store screenshots based on output from `fastlane frameit`.

## Install

```bash
npx screenshot-maker
```

## Usage

1. Run `fastlane frameit` inside a directory of screenshots. This will produce a bunch of image files `*_framed.png`
2. Run `make-screenshots` in the same directory
3. The script will find all the `*_framed.png` files that [fastlane](https://fastlane.tools/) created and spice them up a bit.

|                                          `fastlane frameit`                                          |                                         `screenshot-maker`                                          |
| :--------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
| ![](https://github.com/ninjagains/screenshot-maker/blob/master/examples/Add%20new%20sets_framed.png) | ![](https://github.com/ninjagains/screenshot-maker/blob/master/examples/Add%20new%20sets_final.png) |

The text that appears in the image is currently the same as the file name (this will likely change in the future as it limits what you can write a lot).

## Options

```bash
Usage:
  $ screenshot-maker

Options
  --scale (default: 1)
  --font-size The font size (default: 80)
  --width Final width of the screenshot (default: 1242)
  --height Final height of the screenshot (default: 2208)
  --rotate Phone rotation in radians (float value) (default: 0.03)
  --line-height Text line height in pixels (default: 80)
  --font-family Font Family (default: Open Sans)
  --background-color Solid color or gradient (default: #fff...#ddd)
  --text-color Caption text color (default: #222)
```

## License

MIT
