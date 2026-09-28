import os
import cv2
import numpy as np

base_dir = os.path.dirname(os.path.abspath(__file__))
samples_dir = os.path.join(base_dir, "..", "frontend", "public", "samples")
cctv_dir = os.path.join(base_dir, "..", "frontend", "public", "cctv")
os.makedirs(samples_dir, exist_ok=True)

# 1. Test 1 Image: Clearly visible person
cam1 = cv2.imread(os.path.join(cctv_dir, "cam1.jpg"))
if cam1 is not None:
    cam1_resized = cv2.resize(cam1, (1280, 720))
    cv2.imwrite(os.path.join(samples_dir, "test1_person.jpg"), cam1_resized)
    print("Created test1_person.jpg")

# 2. Test 2 Image: Empty scene, no person/vehicle
cam6 = cv2.imread(os.path.join(cctv_dir, "cam6.jpg"))
if cam6 is not None:
    cam6_resized = cv2.resize(cam6, (1280, 720))
    cv2.imwrite(os.path.join(samples_dir, "test2_empty.jpg"), cam6_resized)
    print("Created test2_empty.jpg")

# 3. Test 3 Video: Moving person video (75 frames at 25 fps = 3 seconds)
if cam1 is not None:
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out_video = cv2.VideoWriter(os.path.join(samples_dir, "test3_moving_person.mp4"), fourcc, 25.0, (960, 540))
    
    # We will slide a crop window across the high-res cam1 image to simulate realistic camera pan/motion
    h_orig, w_orig = cam1.shape[:2]
    crop_w = int(w_orig * 0.85)
    crop_h = int(h_orig * 0.85)
    
    for i in range(75):
        # Pan smoothly
        shift_x = int((w_orig - crop_w) * (i / 74.0))
        shift_y = int((h_orig - crop_h) * 0.5 + np.sin(i * 0.2) * 5)
        crop = cam1[shift_y:shift_y+crop_h, shift_x:shift_x+crop_w]
        frame = cv2.resize(crop, (960, 540))
        
        # Add subtle CCTV timestamp
        ts = f"2026-07-01 03:41:{12 + int(i / 25):02d}.{int((i % 25) * 40):03d}"
        cv2.putText(frame, ts, (15, 520), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)
        out_video.write(frame)
        
    out_video.release()
    print("Created test3_moving_person.mp4")

# 4. Test 4 Video: Dark CCTV footage with low light (brightness ~35)
if cam1 is not None:
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out_dark = cv2.VideoWriter(os.path.join(samples_dir, "test4_dark_night.mp4"), fourcc, 25.0, (960, 540))
    
    for i in range(75):
        shift_x = int((w_orig - crop_w) * (0.3 + 0.3 * (i / 74.0)))
        shift_y = int((h_orig - crop_h) * 0.4)
        crop = cam1[shift_y:shift_y+crop_h, shift_x:shift_x+crop_w]
        frame = cv2.resize(crop, (960, 540))
        
        # Darken significantly to trigger low-light threshold (< 65 brightness)
        dark_frame = cv2.convertScaleAbs(frame, alpha=0.28, beta=3)
        # Add slight blue night tint
        dark_frame[:, :, 0] = cv2.add(dark_frame[:, :, 0], 8)
        
        # Add camera OSD
        ts = f"CAM-06 NIGHT INFRARED 03:43:{10 + int(i / 25):02d}"
        cv2.putText(dark_frame, ts, (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (160, 180, 200), 1)
        out_dark.write(dark_frame)
        
    out_dark.release()
    print("Created test4_dark_night.mp4")

print("All sample assets generated successfully!")
