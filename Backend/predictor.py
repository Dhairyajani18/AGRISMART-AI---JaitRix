import os
import json
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import joblib
import pandas as pd

# Folder where predictor.py exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Model folder
MODEL_DIR = os.path.join(BASE_DIR, "model")

# File paths
MODEL_PATH = os.path.join(
    MODEL_DIR,
    "best_model.pth"
)

CLASS_PATH = os.path.join(
    MODEL_DIR,
    "class_names.json"
)

CROP_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "crop_model.joblib"
)

# -----------------------------
# 0. Load Crop Model
# -----------------------------
crop_model = None
try:
    crop_model = joblib.load(CROP_MODEL_PATH)
    print("Crop model loaded successfully!")
except Exception as e:
    print("Error loading crop model:", e)

# -----------------------------
# 1. Device
# -----------------------------
device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Using device:", device)


# -----------------------------
# 2. Load class names
# -----------------------------
with open(CLASS_PATH, "r") as f:
    class_names = json.load(f)

print("Number of classes:", len(class_names))


# -----------------------------
# 3. Create model architecture
# -----------------------------
model = models.efficientnet_b0(weights=None)

num_classes = len(class_names)

model.classifier = nn.Sequential(
    nn.Dropout(p=0.3),
    nn.Linear(
        model.classifier[1].in_features,
        num_classes
    )
)


# -----------------------------
# 4. Load trained weights
# -----------------------------
model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=device
    )
)

model = model.to(device)

model.eval()

print("Model loaded successfully!")


# -----------------------------
# 5. Image preprocessing
# -----------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# -----------------------------
# 6. Prediction function
# -----------------------------
def predict_image(image_file):

    image = Image.open(image_file).convert("RGB")

    image = transform(image)
    image = image.unsqueeze(0)
    image = image.to(device)

    with torch.no_grad():

        output = model(image)

        probabilities = torch.softmax(output, dim=1)

        confidence, predicted = torch.max(
            probabilities,
            dim=1
        )

    return {
        "class": class_names[predicted.item()],
        "confidence": float(confidence.item())
    }

# -----------------------------
# 7. Crop Prediction function
# -----------------------------
def predict_crop(data_dict):
    if crop_model is None:
        raise ValueError("Crop model is not loaded.")
        
    df = pd.DataFrame([{
        "SOIL": data_dict.get("SOIL"),
        "SEASON": data_dict.get("SEASON"),
        "WATER_SOURCE": data_dict.get("WATER_SOURCE"),
        "SOIL_PH": float(data_dict.get("SOIL_PH", 0)),
        "TEMP": float(data_dict.get("TEMP", 0)),
        "RELATIVE_HUMIDITY": float(data_dict.get("RELATIVE_HUMIDITY", 0)),
        "N": float(data_dict.get("N", 0)),
        "P": float(data_dict.get("P", 0)),
        "K": float(data_dict.get("K", 0))
    }])
    
    probabilities = crop_model.predict_proba(df)[0]
    classes = crop_model.classes_
    
    top_indices = probabilities.argsort()[-3:][::-1]
    
    recommendations = []
    for idx in top_indices:
        recommendations.append({
            "crop": classes[idx],
            "confidence": round(float(probabilities[idx]) * 100, 2)
        })
        
    return recommendations