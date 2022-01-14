
import sharp from "sharp";
import jimp from "jimp";

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function prepareImage(image_buffer): Promise<Buffer> {
  // const sharpImage = await sharp(image_buffer).flatten().toBuffer()

  const image = await jimp.read(image_buffer)
  // save
  // await image.writeAsync(`./test_.png`)
  image.contrast(1);
  await image.writeAsync(`./contrast.png`)
  // convert all colors to white except black
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    if (image.bitmap.data[idx] >= 2) {
      image.bitmap.data[idx] = 255;  // Red
      image.bitmap.data[idx + 1] = 255; // Green
      image.bitmap.data[idx + 2] = 255; // Blue
      image.bitmap.data[idx + 3] = image.bitmap.data[idx + 3]; // Alpha
    }
  });
  //crop 3px from all borders
  image.crop(3, 3, image.bitmap.width - 3, image.bitmap.height - 3);
  // save

  // resize 100%
  image.resize(image.bitmap.width, image.bitmap.height, jimp.RESIZE_NEAREST_NEIGHBOR);
  // save
  await image.writeAsync(`./resize.png`)

  // change dpi to 300
  image.scale(600 / image.bitmap.width);
  // save
  await image.writeAsync(`./scale.png`)

  // docker compose attach container
  // docker-compose attach container

  // conver to 300 dpi
  // image.resize(image.bitmap.width * 3, image.bitmap.height * 3);
  // image.quality(100);
  // image.greyscale();
  // image.contrast(1);
  // image.grayscale();
  // image.contrast(1);
  // image.normalize();
  // image.normalize();

    await image.writeAsync("./captcha.jpeg");
    return image.getBufferAsync(jimp.MIME_JPEG)
}