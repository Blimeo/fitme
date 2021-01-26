import cv2
import numpy as np

from detectron2 import model_zoo
from detectron2.engine import DefaultPredictor
from detectron2.config import get_cfg
import urllib.request as ur


class OutfitMLModel:
    # Returns label boxes segmenting an outfit image uploaded to AWS S3.
    def label_image(self, image_url):
        res = ur.urlopen(image_url)
        img = np.asarray(bytearray(res.read()), dtype="uint8")
        img = cv2.imdecode(img, cv2.IMREAD_COLOR)
        outputs = self.predictor(img)
        instances = outputs["instances"]
        instances_dict = instances.__dict__
        fields = instances_dict.get("_fields")
        boxes = fields["pred_boxes"]
        # Convert pred boxes and their corresponding scores from tensors to lists
        return boxes.tensor.tolist(), fields["scores"].tolist()

    def __init__(self):
        self.cfg = get_cfg()
        self.cfg.merge_from_file(model_zoo.get_config_file(
            "COCO-Detection/faster_rcnn_R_101_FPN_3x.yaml"))
        self.cfg.MODEL.ROI_HEADS.NUM_CLASSES = 13
        self.cfg.MODEL.DEVICE = "cpu"
        self.cfg.MODEL.WEIGHTS = "model.pth"
        # set the testing threshold for this model (lower -> increase sensitivity but also more false positives)
        self.cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.40
        self.predictor = DefaultPredictor(self.cfg)
