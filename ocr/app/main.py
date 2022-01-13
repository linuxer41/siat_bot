from ctypes import Union
from io import BytesIO
from pathlib import Path
import matplotlib.pyplot as plt

import keras_ocr
from typing import Optional

from fastapi import FastAPI, UploadFile, File

app = FastAPI()

# keras-ocr will automatically download pretrained
# weights for the detector and recognizer.
pipeline = keras_ocr.pipeline.Pipeline()

async def get_text_from_image(image_bytes: BytesIO) -> Optional[str]:
    """
    Returns the text from an image.
    """
    # try:
    #     text = pipeline.recognize_text(image_path)
    #     return text
    # except Exception as e:
    #     print(e)
    #     return None

    # Get a set of three example images
    images = [
        keras_ocr.tools.read(image_bytes)
    ]

    # Each list of predictions in prediction_groups is a list of
    # (word, box) tuples.
    prediction_groups = pipeline.recognize(images)
    return prediction_groups


@app.get("/")
async def ocr(file: UploadFile = File(...)):
    """
    Returns the text from an image.
    """
    contents = await file.read()
    buffer = BytesIO(contents)
    data = await get_text_from_image(buffer)
    return {"filename": data}



@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}