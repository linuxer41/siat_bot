import Tesseract, { createWorker, OEM, PSM, recognize } from 'tesseract.js';


const worker = createWorker({
  logger: m => console.log(m)
});
export async function inicialiceTesseractWorker() {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    tessedit_pageseg_mode: PSM.AUTO,
  });
}

export async function closeTesseractWorker() {
  await worker.terminate();
}

export const ocr = async (image_buffer: Buffer) => {
  let result = '';
  // while (result.length !== 6) {
     const { data: { text } } = await worker.recognize(image_buffer)
    

     console.log({text});
      result = text?.replace(/[^a-zA-Z0-9]/g, '').replace(/\s/g, '') || '';
  // }
 return result;
};