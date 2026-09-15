import os
import io
import urllib.parse
import requests
import numpy as np
from PIL import Image, UnidentifiedImageError
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from predictor import predict_image, predict_crop
from .disease_info import DISEASE_INFO

load_dotenv()


# ---------------------------------------------------------------------------
# Disease Detection
# ---------------------------------------------------------------------------

class PredictDiseaseView(APIView):
    def post(self, request):
        image = request.FILES.get("image")
        if not image:
            return Response(
                {
                    "error_code": "INVALID_LEAF_IMAGE",
                    "error": "Please upload a valid image of a crop leaf.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            predicted_output = predict_image(image)
        except (UnidentifiedImageError, OSError):
            return Response(
                {
                    "error_code": "INVALID_LEAF_IMAGE",
                    "error": "Please upload a valid image of a crop leaf.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not predicted_output["valid_leaf"]:
            return Response(
                {
                    "error_code": "INVALID_LEAF_IMAGE",
                    "error": "Please upload a valid image of a crop leaf.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        predicted_class = predicted_output['class']
        confidence = predicted_output['confidence']
        if confidence <= 0.38:
            return Response(
                {
                    "error_code": "LOW_CONFIDENCE_IMAGE",
                    "error": "Image confidence is too low. Please upload a clear crop-leaf image with good lighting and minimal shadows.",
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        info = DISEASE_INFO.get(predicted_class)
        if info is None:
            return Response({
                "class": predicted_class,
                "confidence": confidence,
                "error": "Disease information not available"
            })

        return Response({
            "class": predicted_class,
            "crop": info["crop"],
            "disease": info["disease"],
            "confidence": float(confidence),
            "description": info["description"],
            "symptoms": info["symptoms"],
            "precautions": info["precautions"],
            "severity": info["severity"]
        })


# ---------------------------------------------------------------------------
# Crop Recommendation
# ---------------------------------------------------------------------------

class PredictCropView(APIView):
    def post(self, request):
        try:
            required_fields = ["SOIL", "SEASON", "WATER_SOURCE", "SOIL_PH", "TEMP", "RELATIVE_HUMIDITY", "N", "P", "K"]
            for field in required_fields:
                if field not in request.data:
                    return Response({"error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)
            recommendations = predict_crop(request.data)
            return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ---------------------------------------------------------------------------
# Weather (OpenWeather API)
# ---------------------------------------------------------------------------

class PredictWeatherView(APIView):
    def get(self, request):
        try:
            lat  = request.query_params.get('lat')
            lon  = request.query_params.get('lon')
            city = request.query_params.get('city')

            if not city and (not lat or not lon):
                return Response({"error": "Either city or lat/lon are required"}, status=status.HTTP_400_BAD_REQUEST)

            api_key = os.environ.get('OPENWEATHER_API_KEY')
            # print("fdslf:- ",api_key)
            if not api_key:
                return Response({"error": "OpenWeather API key not configured"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            if city:
                url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
            else:
                url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"

            response = requests.get(url)
            if response.status_code != 200:
                return Response({"error": "Failed to fetch weather data. Please check the location."}, status=status.HTTP_400_BAD_REQUEST)

            data = response.json()
            return Response({
                "temperature": data.get("main", {}).get("temp"),
                "humidity":    data.get("main", {}).get("humidity"),
                "rainfall":    data.get("rain", {}).get("1h", 0) if "rain" in data else 0,
                "city":        data.get("name"),
                "lat":         data.get("coord", {}).get("lat"),
                "lon":         data.get("coord", {}).get("lon"),
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ---------------------------------------------------------------------------
# Soil Data (ISRIC SoilGrids WCS)
# ---------------------------------------------------------------------------

SOILGRIDS_BASE = "http://maps.isric.org/mapserv"
EPSG4326_URI   = "http://www.opengis.net/def/crs/EPSG/0/4326"
WCS_HALF_SIZE  = 0.01   # degrees — ~2km box; smaller boxes miss valid pixels
WCS_TIMEOUT    = 10     # seconds

SOIL_PROPERTIES = [
    {"key": "ph",       "map_file": "phh2o.map",    "coverage": "phh2o_0-5cm_mean",    "scale": 0.1},
    {"key": "nitrogen", "map_file": "nitrogen.map",  "coverage": "nitrogen_0-5cm_mean", "scale": 0.01},
]


def _fetch_soilgrids_value(map_file: str, coverage_id: str, lat: float, lon: float):
    lat_min, lat_max = lat - WCS_HALF_SIZE, lat + WCS_HALF_SIZE
    lon_min, lon_max = lon - WCS_HALF_SIZE, lon + WCS_HALF_SIZE

    base_params = {
        "map": f"/map/{map_file}",
        "SERVICE": "WCS", "VERSION": "2.0.1", "REQUEST": "GetCoverage",
        "COVERAGEID": coverage_id,
        "SUBSETTINGCRS": EPSG4326_URI,
        "OUTPUTCRS":     EPSG4326_URI,
        "FORMAT":        "image/tiff",
    }
    qs  = urllib.parse.urlencode(base_params)
    qs += "&SUBSET=" + urllib.parse.quote(f"long({lon_min},{lon_max})")
    qs += "&SUBSET=" + urllib.parse.quote(f"lat({lat_min},{lat_max})")

    response = requests.get(f"{SOILGRIDS_BASE}?{qs}", timeout=WCS_TIMEOUT)
    if response.status_code != 200:
        return None

    try:
        arr = np.array(Image.open(io.BytesIO(response.content)))
    except Exception:
        return None

    valid = arr[arr > 0].flatten()
    if len(valid) == 0:
        return None

    unique_vals, counts = np.unique(valid, return_counts=True)
    return int(unique_vals[np.argmax(counts)])


class TestSoilView(APIView):
    def get(self, request):
        return Response({"success": True, "message": "Soil API is working"}, status=status.HTTP_200_OK)


class PredictSoilView(APIView):
    def get(self, request):
        try:
            lat_str = request.query_params.get("lat")
            lon_str = request.query_params.get("lon")

            if not lat_str or not lon_str:
                return Response({"success": False, "error": "Both 'lat' and 'lon' are required."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                lat, lon = float(lat_str), float(lon_str)
            except ValueError:
                return Response({"success": False, "error": "lat and lon must be numeric."}, status=status.HTTP_400_BAD_REQUEST)

            if not (-90 <= lat <= 90):
                return Response({"success": False, "error": "Latitude must be between -90 and 90."}, status=status.HTTP_400_BAD_REQUEST)
            if not (-180 <= lon <= 180):
                return Response({"success": False, "error": "Longitude must be between -180 and 180."}, status=status.HTTP_400_BAD_REQUEST)

            soil_result = {}
            for prop in SOIL_PROPERTIES:
                try:
                    raw = _fetch_soilgrids_value(prop["map_file"], prop["coverage"], lat, lon)
                    soil_result[prop["key"]] = round(raw * prop["scale"], 2) if raw is not None else None
                except Exception:
                    soil_result[prop["key"]] = None

            return Response({
                "success":  True,
                "location": {"latitude": lat, "longitude": lon},
                "soil":     soil_result,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)