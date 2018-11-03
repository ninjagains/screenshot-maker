# screenshot-maker

Generate App Store screenshots based on output from `fastlane frameit`.

## Install

```bash
npx make-screenshots
```

## Usage

1. Run `fastlane frameit` inside a directory of screenshots. This will produce a bunch of image files `*_framed.png`
2. Run `make-screenshots` in the same directory
3. The script will find all the `*_framed.png` files that [fastlane](https://fastlane.tools/) created and spice them up a bit.

|                                          `fastlane frameit`                                          |                                         `make-screenshots`                                          |
| :--------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
| ![](https://github.com/ninjagains/screenshot-maker/blob/master/examples/Add%20new%20sets_framed.png) | ![](https://github.com/ninjagains/screenshot-maker/blob/master/examples/Add%20new%20sets_final.png) |

The text that appears in the image is currently the same as the file name (this will likely change in the future as it limits what you can write a lot). Also it is not really configurable in terms of backgrounds and text colors, but that may be implemented going forward.

## Options

```bash
Usage:
    $ node index.js

  Options
    --scale (default: 1)
    --font-size The font size (default: 80)
    --width Final width of the screenshot (default: 1242)
    --height Final height of the screenshot (default: 2208)
```

## License

MIT
