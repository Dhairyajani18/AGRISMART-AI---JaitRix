from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class PredictDiseaseView(APIView):

    def post(self, request):
        image = request.FILES.get("image")

        if not image:
            return Response({"error": "Image is required"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": "Image received successfully",
            "filename": image.name
        })