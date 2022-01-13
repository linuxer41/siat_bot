import { createWorker, recognize } from 'tesseract.js';

const worker = createWorker({
  logger: m => console.log(m)
});

export const ocr = async (url = 'https://tesseract.projectnaptha.com/img/eng_bw.png') => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(url);
//   console.log(text);
  await worker.terminate();
  return text
};