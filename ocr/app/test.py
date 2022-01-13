# import matplotlib.pyplot as plt

import keras_ocr
from typing import Optional

# from fastapi import FastAPI

# app = FastAPI()

# keras-ocr will automatically download pretrained
# weights for the detector and recognizer.
pipeline = keras_ocr.pipeline.Pipeline()

def get_text_from_image(image_path: str) -> Optional[str]:
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
        keras_ocr.tools.read(url) for url in [
            # 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Army_Reserves_Recruitment_Banner_MOD_45156284.jpg',
            # 'https://upload.wikimedia.org/wikipedia/commons/e/e8/FseeG2QeLXo.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/b/b4/EUBanana-500x112.jpg'
        ]
    ]

    # Each list of predictions in prediction_groups is a list of
    # (word, box) tuples.
    prediction_groups = pipeline.recognize(images)
    print(prediction_groups)
get_text_from_image("asd.png")