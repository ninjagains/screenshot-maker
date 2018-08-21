const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const glob = require('glob');
const meow = require('meow');

const cli = meow(`
  Usage: node index.js
`);

const phoneScale = parseFloat(cli.flags.scale) || 1;
const fontSize = parseInt(cli.flags.fontSize) || 80;
const width = parseInt(cli.flags.width) || 1242;
const height = parseInt(cli.flags.height) || 2208;

async function createImageFromFastlaneFrame(frameFile) {
  const match = frameFile.match(/(.+)_framed.png$/);
  if (!match) {
    throw new Error('Invalid file name. It should end with _framed.png');
  }

  const caption = match[1].replace(/_/g, ' ');
  const outputFilename = path.basename(frameFile, '_framed.png') + '_final.png';

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = makeGradient();
  ctx.fillRect(0, 0, width, height);

  function makeGradient(from = '#fff', to = '#ddd') {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, from);
    gradient.addColorStop(1, to);
    return gradient;
  }

  function drawCaption(ctx, caption, maxWidth) {
    ctx.save();
    ctx.font = `bold ${fontSize}px Open Sans`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    fillText(ctx, caption, width / 2, 240, maxWidth);
    ctx.restore();
  }

  const image = await loadImage(frameFile);

  const scaledWidth = image.width * phoneScale;
  const scaledHeight = image.height * phoneScale;

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(0.03);
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
