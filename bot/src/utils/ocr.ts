import Tesseract, { createWorker, recognize } from 'tesseract.js';


const worker = createWorker({
  logger: m => console.log(m)
});
export async function inicialiceTesseractWorker() {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
}

export async function closeTesseractWorker() {
  await worker.terminate();
}

export const ocr = async (image_buffer: Buffer) => {
  const { data: { text } } = await worker.recognize(image_buffer);
  return text?.replace(/[^a-zA-Z0-9]/g, '').replace(/\s/g, '') || '';
};