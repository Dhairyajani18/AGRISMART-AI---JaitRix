from django.urls import path
from .views import PredictDiseaseView, PredictCropView, PredictWeatherView, PredictSoilView, TestSoilView


urlpatterns = [
    path("predict/", PredictDiseaseView.as_view()),
    path("recommend-crop/", PredictCropView.as_view()),
    path("recommend-crop/weather/", PredictWeatherView.as_view()),
    path("recommend-crop/soil/", PredictSoilView.as_view()),
    path("recommend-crop/soil/test/", TestSoilView.as_view()),
]