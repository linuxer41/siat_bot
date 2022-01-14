import easyocr

import cv2
import numpy as np
from typing import Optional

from fastapi import FastAPI, UploadFile, File

app = FastAPI()

# keras-ocr will automatically download pretrained
# weights for the detector and recognizer.

 # this needs to run only once to load the model into memory


@app.post("/")
async def ocr(file: UploadFile = File(...)):
    """
    Returns the text from an image.
    """
    reader = easyocr.Reader(['en'], gpu=False)
    image_for_decode: bytes - None

    # save the image
    # cv2.imwrite("test3.png", blank)
    # image decode
    contents = await file.read()
    jpg_as_np = np.frombuffer(contents, dtype=np.uint8)
    img = cv2.imdecode(jpg_as_np, cv2.IMREAD_COLOR)
    # check image size
    if img.shape[0] > 1000 or img.shape[1] > 1000:
        return {"message": "Image size is too large"}
    # check image size minumum 500x500
    if img.shape[0] < 500 or img.shape[1] < 500:   
        # create a blank image 500x500
        blank = np.zeros((500,500, 3), np.uint8)
        # draw a rectangle
        cv2.rectangle(blank, (0, 0), (500,500), (255, 255, 255), -1)
        # paste the image into the rectangle
        blank[0:img.shape[0], 0:img.shape[1]] = img
        image_for_decode = blank
        cv2.imwrite("test.png", blank)
    else:
        image_for_decode = img
    data = reader.readtext(image_for_decode, detail=0)
    print(data)
    return {'result': 'ok'}



@app.get("/")
def get():
    return {
        "message": "Hello World"
    }