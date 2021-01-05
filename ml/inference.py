import matplotlib.pyplot as plt
from detectron2.utils.visualizer import ColorMode
import torch
import torchvision
import cv2
import os

from detectron2 import model_zoo
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
from detectron2.utils.visualizer import Visualizer
from detectron2.data import MetadataCatalog
from detectron2.data.datasets import register_coco_instances

cfg = get_cfg()
cfg.merge_from_file(model_zoo.get_config_file(
    "COCO-Detection/faster_rcnn_R_101_FPN_3x.yaml"))
cfg.MODEL.ROI_HEADS.NUM_CLASSES = 13
cfg.MODEL.DEVICE = "cpu"
cfg.MODEL.WEIGHTS = os.path.join(cfg.OUTPUT_DIR, "model_final.pth")
# set the testing threshold for this model (lower -> increase sensitivity but also more false positives)
cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.27

predictor = DefaultPredictor(cfg)

im = cv2.imread("a.jpg")  # or whatever filename you want
outputs = predictor(im)
print(outputs)

# uncomment these lines for bbox visualization
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
# adjust scale if u feel like output is too small
v = Visualizer(im[:, :, ::-1], scale=1.0)
v = v.draw_instance_predictions(outputs["instances"].to("cpu"))
cv2.imwrite('output.png', v.get_image()[:, :, ::-1])

plt.imshow(cv2.cvtColor(v.get_image()[:, :, ::-1], cv2.COLOR_BGR2RGB))
plt.show()
