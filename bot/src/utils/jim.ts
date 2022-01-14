
import sharp from "sharp";
import jimp from "jimp";

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function prepareImage(image_buffer): Promise<Buffer> {
  const sharpImage = await sharp(image_buffer).flatten().toBuffer()
  const image = await jimp.read(sharpImage)
  // });
  // convert all colors to white except black
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    if (image.bitmap.data[idx] >= 2) {
      image.bitmap.data[idx] = 255;
      image.bitmap.data[idx + 1] = 255;
      image.bitmap.data[idx + 2] = 255;
      image.bitmap.data[idx + 3] = image.bitmap.data[idx + 3];
    }
  });

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