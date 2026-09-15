# AgriSmart AI

AgriSmart AI is an intelligent agriculture support platform developed for SIH 2026. It combines AI-powered crop disease detection, data-driven crop recommendations, and a seven-day weather forecast to help farmers make more informed decisions.

## 1. Modules Built

### Core: Crop Disease Detection

- Upload a crop or leaf image.
- The backend predicts one of 38 disease or healthy classes.
- The result includes the predicted class, confidence score, disease details, symptoms, severity, and precautions when this information is available.
- The disease model is an EfficientNet-B0 model stored at `Backend/model/best_model.pth`.

### Bonus: Crop Recommendation

The crop recommendation model returns the top three crops based on:

- Soil type
- Season
- Water source
- Soil pH
- Temperature
- Relative humidity
- Nitrogen, phosphorus, and potassium values

It uses a Random Forest classifier with one-hot encoding for the categorical inputs. The model file, `Backend/model/crop_model.joblib`, is created by the training script.

### Bonus: Weather-Based Intelligence / Seven-Day Weather Forecast

Users can search for a city or use their current location to view current conditions and a seven-day forecast. The forecast shows daily high and low temperatures and precipitation. It also provides agricultural weather insights including rainfall, heat, humidity, farm-activity, and irrigation guidance based on forecast conditions.

### Bonus: Multilingual Support

The interface includes translations for English, Hindi, and Gujarati. The selected language is saved in the browser.

## 2. Setup and Run

### Prerequisites

- Python 3
- Node.js and npm

### Clone Repo
```bash
git clone https://github.com/Preyans-alt/AGRISMART-AI---JaitRix.git
cd AGRISMART-AI---JaitRix
```

### Backend

```bash
cd Backend
pip install -r requirements.txt
```

Create `Backend/.env` if you want to use the weather helper used by the crop form:
```env
OPENWEATHER_API_KEY=your_openweather_api_key
```

Create the crop recommendation model:

```bash
python model/train_crop_model.py
```

Start the API:

```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend

Open a second terminal:

```bash
cd AGRISMART-AI---JaitRix (if outside of folder)
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:3000`.

Set `VITE_API_BASE_URL=http://localhost:8000` in `frontend/.env` if required.

  ### A. Make a Disease Prediction

The backend accepts a plant image for disease prediction through the `POST /api/predict/` endpoint.

To test the prediction locally:

1. Open a terminal and navigate to the `Backend` folder inside AGRISMART-AI---JaitRix.
2. Run the prediction script with the path to your image:

```bash
python test_prediction.py "path/to/your/image.jpg"
```

**Example:**

```bash
python test_prediction.py "C:\SomePath\Downloads\leaf.jpg"
```

It returns the predicted class and confidence.

  ### B. Make a Crop Recommendation

After running the crop training script, send a request to `POST /api/recommend-crop/`:

```bash
curl -X POST http://127.0.0.1:8000/api/recommend-crop/ -H "Content-Type: application/json" -d '{"SOIL":"Alluvial soil","SEASON":"kharif","WATER_SOURCE":"irrigated","SOIL_PH":7.1,"TEMP":31.5,"RELATIVE_HUMIDITY":68,"N":1.17,"P":40,"K":45}'
```

## 3. Dataset

### Crop Disease Detection

- Model labels: 38 disease and healthy classes listed in `Backend/model/class_names.json`.
- Dataset: PlantVillage
- Images: 54,305 across 38 disease and healthy classes
- Split: 43,429 training, 5,417 validation, and 5,459 development-test images
- Dataset source/license: [PlantVillage Dataset](https://www.kaggle.com/abdallahalidev/plantvillage-dataset) — CC BY-NC-SA 4.0

The repository contains the trained weights and class list, but not the disease training dataset or its training script. The held-out test set usage cannot be confirmed from this repository.

###   

- Dataset: `Backend/model/Crop recommendation dataset.csv`
- Rows: 57,000
- Target column: `CROPS`
- Input columns used: `SOIL`, `SEASON`, `WATER_SOURCE`, `SOIL_PH`, `TEMP`, `RELATIVE_HUMIDITY`, `N`, `P`, and `K`
- Split: 80% training and 20% test, using stratified sampling with `random_state=42`
- Dataset source/license: [Kaggle – Crop Recommendation Dataset](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset) — [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
  
## 4. Model and Evaluation

| Module | Model | Details | Results |
| --- | --- | --- | --- |
| Disease detection | EfficientNet-B0 | 224 x 224 RGB input, dropout 0.3, 38 output classes | Development-test accuracy: 99.63% \| Macro-F1: 99.47% \| Macro precision: 99.52% \| Macro recall: 99.43% \| Weighted F1: 99.63% \| Test loss: 0.0114 |
| Crop recommendation | Random Forest | 200 trees, one-hot encoding for soil, season, and water source | Development-test accuracy: 98.51% \| Macro-F1: 98.51% |


Disease model creation and training process: [Google Colab notebook](https://colab.research.google.com/drive/1-nR4wYrACsRQxC3Nun5PpQG69_-mUUpt?usp=sharing)

## 5. Architecture

```text
React Frontend
  |
  +-- Crop Disease Detection
  +-- Crop Recommendation
  +-- 7-Day Weather Forecast
  +-- Agricultural Weather Insights
  |
  v
Django REST Backend
  |
  +-- EfficientNet-B0
  +-- Random Forest
  +-- Weather API
  +-- Weather Insight Rules
```

```text
Leaf image
  -> React frontend
  -> Django REST API
  -> Resize to 224 x 224 and normalize image
  -> EfficientNet-B0 model
  -> Disease class, confidence, and precautions
```

```text
Farm and soil inputs
  -> React frontend
  -> Django REST API
  -> One-hot encoding and numeric features
  -> Random Forest model
  -> Top three crop recommendations
```

## 6. Known Limitations

* **Limited disease coverage:** The disease detection model is trained to recognize a defined set of 38 disease/healthy classes and does not cover all possible crop diseases.
* **Real-world conditions:** Prediction performance may vary with lighting, image quality, complex backgrounds, occlusion, and disease severity.
* **Similar symptoms:** Some visually similar diseases may occasionally be misclassified.
* **Input dependency:** Crop recommendations depend on the accuracy and completeness of the soil and environmental inputs provided by the user.
* **Weather dependency:** Weather information depends on the availability and accuracy of the external weather data service.


## 7. Demo and Deployment

Demo Video: [ADD DEMO VIDEO LINK]


## 8. References

- PyTorch and Torchvision for disease model inference.
- Django REST Framework for the backend API.
- Scikit-learn for crop recommendation training and inference.
- OpenWeather API and ISRIC SoilGrids are used by the optional crop-form data helpers.

