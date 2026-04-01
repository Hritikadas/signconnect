import cv2
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python.vision import HandLandmarker, HandLandmarkerOptions, RunningMode
import numpy as np
import urllib.request
import os

# Auto-download the model file if not present
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hand_landmarker.task")

def download_model():
    if not os.path.exists(MODEL_PATH):
        print("Downloading hand_landmarker.task model (~25MB)...")
        url = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
        urllib.request.urlretrieve(url, MODEL_PATH)
        print("Model downloaded successfully.")

download_model()

# Hand connections for drawing
HAND_CONNECTIONS = [
    (0,1),(1,2),(2,3),(3,4),
    (0,5),(5,6),(6,7),(7,8),
    (0,9),(9,10),(10,11),(11,12),
    (0,13),(13,14),(14,15),(15,16),
    (0,17),(17,18),(18,19),(19,20),
    (5,9),(9,13),(13,17)
]


class handDetector():
    '''
    Hand detector using MediaPipe Tasks API.
    Compatible with mediapipe 0.10.30+
    '''

    def __init__(self, mode=False, max_hands=2, detection_con=0.5, presence_con=0.5, track_con=0.5):
        self.mode = mode
        self.max_hands = max_hands
        self.detection_con = detection_con
        self.presence_con = presence_con
        self.track_con = track_con
        self.results = None
        self._frame_timestamp = 0

        running_mode = RunningMode.IMAGE if mode else RunningMode.VIDEO

        options = HandLandmarkerOptions(
            base_options=mp_python.BaseOptions(model_asset_path=MODEL_PATH),
            running_mode=running_mode,
            num_hands=max_hands,
            min_hand_detection_confidence=detection_con,
            min_hand_presence_confidence=presence_con,
            min_tracking_confidence=track_con
        )
        self.detector = HandLandmarker.create_from_options(options)

    def find_hands(self, img, draw=True):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=imgRGB)

        if self.mode:
            self.results = self.detector.detect(mp_image)
        else:
            self._frame_timestamp += 1
            self.results = self.detector.detect_for_video(mp_image, self._frame_timestamp)

        if draw and self.results and self.results.hand_landmarks:
            h, w, _ = img.shape
            for hand_landmarks in self.results.hand_landmarks:
                for lm in hand_landmarks:
                    cx, cy = int(lm.x * w), int(lm.y * h)
                    cv2.circle(img, (cx, cy), 4, (0, 255, 0), cv2.FILLED)
                for start, end in HAND_CONNECTIONS:
                    x1 = int(hand_landmarks[start].x * w)
                    y1 = int(hand_landmarks[start].y * h)
                    x2 = int(hand_landmarks[end].x * w)
                    y2 = int(hand_landmarks[end].y * h)
                    cv2.line(img, (x1, y1), (x2, y2), (0, 255, 0), 2)

        return img

    def find_position(self, img, draw=True):
        all_landmarks = []

        if not self.results or not self.results.hand_landmarks:
            return all_landmarks

        h, w, _ = img.shape

        for i, hand_landmarks in enumerate(self.results.hand_landmarks):
            label = "Right"
            if self.results.handedness and i < len(self.results.handedness):
                label = self.results.handedness[i][0].category_name

            landmark_list = []
            for id, lm in enumerate(hand_landmarks):
                cx, cy = int(lm.x * w), int(lm.y * h)
                landmark_list.append([id, cx, cy])
                if draw:
                    cv2.circle(img, (cx, cy), 5, (255, 255, 255), cv2.FILLED)

            all_landmarks.append((label, landmark_list))

        return all_landmarks

    def get_landmarks_flat(self, hand_index=0):
        '''Returns flat list of 63 floats (21 landmarks * x,y,z) for ML model input.'''
        if not self.results or not self.results.hand_landmarks:
            return None
        if hand_index >= len(self.results.hand_landmarks):
            return None
        flat = []
        for lm in self.results.hand_landmarks[hand_index]:
            flat.extend([lm.x, lm.y, lm.z])
        return flat
