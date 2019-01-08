const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const glob = require('glob');
const meow = require('meow');

const cli = meow(`
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
`);

const phoneScale = parseFloat(cli.flags.scale) || 1;
const fontSize = parseInt(cli.flags.fontSize) || 80;
const width = parseInt(cli.flags.width) || 1242;
const height = parseInt(cli.flags.height) || 2208;
const rotate = parseFloat(cli.flags.rotate) || 0.03;
const lineHeight = parseInt(cli.flags.lineHeight) || 80;
const fontFamily = cli.flags.fontFamily || 'Open Sans';
const textColor = cli.flags.textColor || '#222';
const backgroundColor = cli.flags.backgroundColor || '#fff...#ddd';

async function createImageFromFastlaneFrame(frameFile) {
  const match = frameFile.match(/(.+)_framed.png$/);
  if (!match) {
    throw new Error('Invalid file name. It should end with _framed.png');
  }

  const caption = match[1].replace(/_/g, ' ');
  const outputFilename = path.basename(frameFile, '_framed.png') + '_final.png';

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = makeGradient(parseGradientString(backgroundColor));
  ctx.fillRect(0, 0, width, height);

  function parseGradientString(gradientString) {
    return gradientString.split('...');
  }

  function makeGradient(stops) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    for (let i = 0; i < stops.length; i++) {
      gradient.addColorStop(i / Math.max(1, stops.length - 1), stops[i]);
    }
    return gradient;
  }

  function drawCaption(ctx, caption, maxWidth) {
    ctx.save();
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    fillText(ctx, caption, width / 2, 240, maxWidth, lineHeight);
    ctx.restore();
  }

  const image = await loadImage(frameFile);

  const scaledWidth = image.width * phoneScale;
  const scaledHeight = image.height * phoneScale;

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(rotate);
  ctx.translate(-width / 2, -height / 2);
  ctx.drawImage(
    image,
    width / 2 - scaledWidth / 2,
    height - scaledHeight - 60,
    scaledWidth,
    scaledHeight
  );
  ctx.restore();

  drawCaption(ctx, caption, scaledWidth + 80);
  fs.writeFile(outputFilename, canvas.toBuffer(), err => {
    if (err) {
      throw err;
    }
  });
}

function fillText(ctx, text, x, y, maxWidth, lineHeight = 80) {
  const words = text.split(' ');
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const currentLine = line + words[i] + ' ';
    const { width: currentWidth } = ctx.measureText(currentLine);

    if (currentWidth > maxWidth && i > 0) {
      ctx.fillText(line, width / 2, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = currentLine;
    }
  }

  ctx.fillText(line, width / 2, y);
}

const globAsync = pattern =>
  new Promise((resolve, reject) => {
    glob(pattern, {}, (err, files) => {
      if (err) return reject(err);
      return resolve(files);
    });
  });

async function main() {
  const files = await globAsync('*_framed.png');
  for (const file of files) {
    await createImageFromFastlaneFrame(file);
  }
}

main();
