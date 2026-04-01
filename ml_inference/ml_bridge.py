from hand_detector2 import handDetector
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import pickle
import numpy as np
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model lazily so startup doesn't fail if model file is missing
model = None
MODEL_FILE = os.path.join(os.path.dirname(__file__), "sign_model.pkl")

def get_model():
    global model
    if model is None:
        if not os.path.exists(MODEL_FILE):
            raise FileNotFoundError(
                "sign_model.pkl not found. Run train_sign_model.py first."
            )
        with open(MODEL_FILE, "rb") as f:
            model = pickle.load(f)
    return model

# Create detector instance once at startup
detector = handDetector(detection_con=0.7)


class HandData(BaseModel):
    landmarks: list  # flat list of 63 floats (21 points * x,y,z)


@app.get("/")
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "ML Bridge is online"}


@app.post("/predict")
async def predict_sign(data: HandData):
    try:
        clf = get_model()
        input_data = np.array(data.landmarks).reshape(1, -1)
        prediction = clf.predict(input_data)
        return {
            "prediction": str(prediction[0]),
            "status": "success"
        }
    except FileNotFoundError as e:
        return {"status": "error", "message": str(e)}
    except Exception as e:
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    print("Starting SignConnect ML Bridge on http://127.0.0.1:5050")
    uvicorn.run(app, host="127.0.0.1", port=5050)
