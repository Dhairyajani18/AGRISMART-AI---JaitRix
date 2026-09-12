from predictor import predict_crop

data = {
    "soil": "Alluvial soil",
    "season": "kharif",
    "water_source": "irrigated",
    "soil_ph": 7.6,
    "temperature": 26.9,
    "humidity": 73.8,
    "nitrogen": 82.4,
    "phosphorus": 40.7,
    "potassium": 42.2
}
try:
    print(predict_crop(data))
except Exception as e:
    print("Error:", e)
