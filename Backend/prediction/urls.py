from django.urls import path
from .views import PredictDiseaseView, PredictCropView


urlpatterns = [
    path("predict/", PredictDiseaseView.as_view()),
    path("recommend-crop/", PredictCropView.as_view()),
]