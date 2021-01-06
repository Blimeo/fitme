import cv2
import os

from detectron2 import model_zoo
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg


predictor = DefaultPredictor(cfg)

im = cv2.imread("a.jpg")  # or whatever filename you want
outputs = predictor(im)
print(outputs)


class OutfitMLModel:
    '''Returns label boxes segmenting an outfit image uploaded to AWS S3.
    '''

    def label_s3_image(self, file):
        im = cv2.imread("a.jpg")

    def __init__(self):
        self.cfg = get_cfg()
        self.cfg.merge_from_file(model_zoo.get_config_file(
            "COCO-Detection/faster_rcnn_R_101_FPN_3x.yaml"))
        self.cfg.MODEL.ROI_HEADS.NUM_CLASSES = 13
        self.cfg.MODEL.DEVICE = "cpu"
        self.cfg.MODEL.WEIGHTS = os.path.join(
            self.cfg.OUTPUT_DIR, "model_final.pth")
        # set the testing threshold for this model (lower -> increase sensitivity but also more false positives)
        self.cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.27
        self.predictor = DefaultPredictor(cfg)
