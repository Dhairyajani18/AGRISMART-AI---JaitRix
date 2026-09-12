from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from predictor import predict_image, predict_crop
from .disease_info import DISEASE_INFO

class PredictDiseaseView(APIView):

    def post(self, request):
        # print(request.data)
        image = request.FILES.get("image")

        if not image:
            return Response({"error": "Image is required"}, status=status.HTTP_400_BAD_REQUEST)

        predicted_output = predict_image(image)
        # print(predicted_output)
        predicted_class = predicted_output['class']
        confidence = predicted_output['confidence']

    # Example:
    #
    # predicted_class = "Tomato___Early_blight"
    # confidence = 0.91

    # ------------------------------------------------
    # Get information about predicted disease
    # ------------------------------------------------

        info = DISEASE_INFO.get(predicted_class)

        if info is None:
            return Response({
                "class": predicted_class,
                "confidence": confidence,
                "error": "Disease information not available"
            })

        # ------------------------------------------------
        # Send result to React
        # ------------------------------------------------

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
        # return Response(status.HTTP_200_OK)

class PredictCropView(APIView):
    def post(self, request):
        try:
            required_fields = ["soil", "season", "water_source", "soil_ph", "temperature", "humidity", "nitrogen", "phosphorus", "potassium"]
            
            for field in required_fields:
                if field not in request.data:
                    return Response({"error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)
            
            recommendations = predict_crop(request.data)
            return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)