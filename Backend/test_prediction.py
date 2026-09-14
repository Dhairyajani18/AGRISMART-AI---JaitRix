import sys
from predictor import predict_image

if len(sys.argv) < 2:
    print("Usage: python predict.py <image_path>")
    sys.exit(1)

image_path = sys.argv[1]

result = predict_image(image_path)

print("prediction:- \n",result)