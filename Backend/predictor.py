import os
import json
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

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