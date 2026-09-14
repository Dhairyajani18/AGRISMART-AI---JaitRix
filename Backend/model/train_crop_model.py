import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, classification_report


df = pd.read_csv("model/Crop recommendation dataset.csv")

features = [
    "SOIL",
    "SEASON",
    "WATER_SOURCE",
    "SOIL_PH",
    "TEMP",
    "RELATIVE_HUMIDITY",
    "N",
    "P",
    "K"
]

X = df[features]
y = df["CROPS"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

categorical = ["SOIL", "SEASON", "WATER_SOURCE"]
numerical = [
    "SOIL_PH",
    "TEMP",
    "RELATIVE_HUMIDITY",
    "N",
    "P",
    "K"
]

preprocessor = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
    ("num", "passthrough", numerical)
])

model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    ))
])

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("Macro F1:", f1_score(y_test, y_pred, average="macro"))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

joblib.dump(model, "model/crop_model.joblib")

print("\nModel saved as crop_model.joblib")