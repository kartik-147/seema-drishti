import os
import cv2
import numpy as np
from ultralytics import YOLO

base_dir = os.path.dirname(os.path.abspath(__file__))
public_videos_dir = os.path.join(base_dir, "..", "frontend", "public", "videos")
cctv_dir = os.path.join(base_dir, "..", "frontend", "public", "cctv")
os.makedirs(public_videos_dir, exist_ok=True)

out_w, out_h = 960, 540
num_frames = 250 # 10 seconds @ 25 fps
fps = 25.0

# Setup encoders: genuine H.264 (avc1 via openh264) and VP8 (VP80 for webm)
fourcc_mp4 = cv2.VideoWriter_fourcc(*'avc1')
fourcc_webm = cv2.VideoWriter_fourcc(*'VP80')

camera_configs = [
    {
        "cam_idx": 1,
        "img": "cam1.jpg",
        "title": "NORTH BORDER",
        "code": "CAM-01",
        # Person is around x=627..792. Pan window from x=260 to 880 so person moves right -> left and completely exits
        "start_x": 260,
        "end_x": 880,
        "start_y": 140,
        "end_y": 170,
        "crop_w": 620,
        "crop_h": 460,
        "dark": False
    },
    {
        "cam_idx": 2,
        "img": "cam2.jpg",
        "title": "CHECK POST",
        "code": "CAM-02",
        # Persons are at x=423..518. Pan window across [150..580] so persons move across checkpost
        "start_x": 160,
        "end_x": 480,
        "start_y": 180,
        "end_y": 190,
        "crop_w": 640,
        "crop_h": 480,
        "dark": False
    },
    {
        "cam_idx": 3,
        "img": "cam3.jpg",
        "title": "RIVER SIDE",
        "code": "CAM-03",
        # Person is at x=655..718, y=480..656. Pan window across [350..720]
        "start_x": 380,
        "end_x": 680,
        "start_y": 240,
        "end_y": 270,
        "crop_w": 640,
        "crop_h": 480,
        "dark": False
    },
    {
        "cam_idx": 4,
        "img": "cam4.jpg",
        "title": "PERIMETER RIDGE",
        "code": "CAM-04",
        # Persons are at x=914..988, y=405..572. Pan window across [620..940]
        "start_x": 640,
        "end_x": 920,
        "start_y": 200,
        "end_y": 220,
        "crop_w": 640,
        "crop_h": 480,
        "dark": False
    },
    {
        "cam_idx": 5,
        "img": "cam5.jpg",
        "title": "EASTERN FENCE",
        "code": "CAM-05",
        "start_x": 200,
        "end_x": 500,
        "start_y": 150,
        "end_y": 180,
        "crop_w": 680,
        "crop_h": 500,
        "dark": False
    },
    {
        "cam_idx": 6,
        "img": "cam6.jpg",
        "title": "SECTOR GATE",
        "code": "CAM-06",
        "start_x": 150,
        "end_x": 350,
        "start_y": 120,
        "end_y": 140,
        "crop_w": 700,
        "crop_h": 520,
        "dark": True
    }
]

yolo = YOLO(os.path.join(base_dir, "yolov8n.pt"))

print("Generating H.264 and WebM videos for 6 CCTV feeds...")

for cfg in camera_configs:
    c_idx = cfg["cam_idx"]
    img_path = os.path.join(cctv_dir, cfg["img"])
    src = cv2.imread(img_path)
    if src is None:
        print(f"Error loading {img_path}")
        continue

    src_h, src_w = src.shape[:2]

    mp4_path = os.path.join(public_videos_dir, f"camera{c_idx}.mp4")
    webm_path = os.path.join(public_videos_dir, f"camera{c_idx}.webm")

    writer_mp4 = cv2.VideoWriter(mp4_path, fourcc_mp4, fps, (out_w, out_h))
    writer_webm = cv2.VideoWriter(webm_path, fourcc_webm, fps, (out_w, out_h))

    person_detected_count = 0

    for i in range(num_frames):
        t = i / float(num_frames - 1)
        sx = int(cfg["start_x"] + t * (cfg["end_x"] - cfg["start_x"]))
        sy = int(cfg["start_y"] + np.sin(i * 0.08) * 6)

        cw = cfg["crop_w"]
        ch = cfg["crop_h"]

        # Clamp inside boundaries
        sx = max(0, min(src_w - cw, sx))
        sy = max(0, min(src_h - ch, sy))

        crop = src[sy:sy+ch, sx:sx+cw]
        frame = cv2.resize(crop, (out_w, out_h))

        if cfg["dark"]:
            frame = cv2.convertScaleAbs(frame, alpha=0.30, beta=4)
            frame[:, :, 0] = cv2.add(frame[:, :, 0], 8) # Night tint

        # Tactical OSD timecode
        sec = int(i / fps)
        msec = int((i % fps) * 40)
        timecode = f"{cfg['code']} {cfg['title']}  03:41:{sec:02d}.{msec:03d}"
        cv2.putText(frame, timecode, (15, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.44, (255, 255, 255), 1)
        cv2.putText(frame, f"LIVE REC  FRAME {i:04d}", (out_w - 170, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.44, (0, 255, 120), 1)

        # Check YOLO person detection on sample frames
        if i % 50 == 0:
            res = yolo(frame, verbose=False, conf=0.35)[0]
            p_cnt = len([b for b in res.boxes if int(b.cls[0]) == 0])
            if p_cnt > 0:
                person_detected_count += 1

        writer_mp4.write(frame)
        writer_webm.write(frame)

    writer_mp4.release()
    writer_webm.release()

    mp4_sz = os.path.getsize(mp4_path) if os.path.exists(mp4_path) else 0
    webm_sz = os.path.getsize(webm_path) if os.path.exists(webm_path) else 0
    print(f"[CAM-0{c_idx}] Generated camera{c_idx}.mp4 ({mp4_sz//1024} KB) and camera{c_idx}.webm ({webm_sz//1024} KB) | Persons verified: {person_detected_count > 0}")

print("\nALL CCTV VIDEO FEEDS GENERATED IN BOTH H.264 MP4 AND WEBM!")
