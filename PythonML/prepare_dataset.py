import os

train_images = "D:\PythonML\yolov7\HD/train/images"
valid_images = "D:\PythonML\yolov7\HD/valid/images"

with open("train.txt", "w") as f:
    for img in os.listdir(train_images):
        f.write(os.path.join(train_images, img) + "\n")

with open("val.txt", "w") as f:
    for img in os.listdir(valid_images):
        f.write(os.path.join(valid_images, img) + "\n")

print("Dataset paths saved!")
