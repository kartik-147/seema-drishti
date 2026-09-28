import os
import cv2
import numpy as np

base_dir = os.path.dirname(os.path.abspath(__file__))
public_videos_dir = os.path.join(base_dir, "..", "frontend", "public", "videos")
cctv_dir = os.path.join(base_dir, "..", "frontend", "public", "cctv")
os.makedirs(public_videos_dir, exist_ok=True)

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
fps = 25.0
out_w, out_h = 960, 540
num_frames = 250 # 10 seconds per video

def generate_panning_video(img_name, out_name, cam_code, cam_title, pan_direction="horizontal", is_dark=False, person_exits=False):
    img_path = os.path.join(cctv_dir, img_name)
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found")
        return
        
    src = cv2.imread(img_path)
    if src is None:
        print(f"Error reading {img_path}")
        return
        
    src_h, src_w = src.shape[:2]
    # Crop size roughly 75% of original to allow smooth panning
    crop_w = int(src_w * 0.70)
    crop_h = int(src_h * 0.70)
    max_shift_x = src_w - crop_w
    max_shift_y = src_h - crop_h
    
    out_path = os.path.join(public_videos_dir, out_name)
    writer = cv2.VideoWriter(out_path, fourcc, fps, (out_w, out_h))
    
    for i in range(num_frames):
        t = i / float(num_frames - 1)
        
        if pan_direction == "person_walk_and_exit":
            # Person in cam1.jpg is at x=627..792.
            # Crop width 620, height 480.
            # Start at shift_x = 240 (person at 627 is inside [240, 860])
            # By frame 190, shift_x reaches 820+ (person at 792 is < 820, so person has completely exited!)
            start_x = 240
            end_x = 840
            shift_x = int(start_x + t * (end_x - start_x))
            shift_y = int(max_shift_y * 0.45)
            crop_w = 620
            crop_h = 480
        elif pan_direction == "sway":
            shift_x = int(max_shift_x * 0.5 + np.sin(i * 0.08) * (max_shift_x * 0.35))
            shift_y = int(max_shift_y * 0.5 + np.cos(i * 0.06) * 6)
        else:
            shift_x = int(max_shift_x * (0.5 + 0.4 * np.sin(i * 0.05)))
            shift_y = int(max_shift_y * 0.4)
            
        crop = src[shift_y:shift_y+crop_h, shift_x:shift_x+crop_w]
        frame = cv2.resize(crop, (out_w, out_h))
        
        if is_dark:
            # Dark night infrared look for CAM-06
            frame = cv2.convertScaleAbs(frame, alpha=0.32, beta=3)
            # Add subtle green/blue night tint
            frame[:, :, 0] = cv2.add(frame[:, :, 0], 8)
            
        # Add surveillance OSD timestamp
        sec = int(i / fps)
        msec = int((i % fps) * 40)
        timecode = f"{cam_code} {cam_title}  2026-07-01 03:41:{sec:02d}.{msec:03d}"
        cv2.putText(frame, timecode, (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)
        cv2.putText(frame, f"LIVE REC  FRAME {i:04d}", (out_w - 180, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 120), 1)
        
        writer.write(frame)
        
    writer.release()
    print(f"Generated {out_name} ({num_frames} frames, {fps} fps)")

# 1. camera1.mp4: Person moves across frame and exits (Tests 1, 2, 4)
generate_panning_video("cam1.jpg", "camera1.mp4", "CAM-01", "NORTH BORDER", pan_direction="person_walk_and_exit")

# 2. camera2.mp4: Checkpost traffic
generate_panning_video("cam2.jpg", "camera2.mp4", "CAM-02", "CHECK POST", pan_direction="sway")

# 3. camera3.mp4: River side
generate_panning_video("cam3.jpg", "camera3.mp4", "CAM-03", "RIVER SIDE", pan_direction="sway")

# 4. camera4.mp4: Perimeter ridge
generate_panning_video("cam4.jpg", "camera4.mp4", "CAM-04", "PERIMETER RIDGE", pan_direction="sway")

# 5. camera5.mp4: Eastern fence
generate_panning_video("cam5.jpg", "camera5.mp4", "CAM-05", "EASTERN FENCE", pan_direction="sway")

# 6. camera6.mp4: Sector gate (Dark night, 0 detections - Tests 4, 5)
generate_panning_video("cam6.jpg", "camera6.mp4", "CAM-06", "SECTOR GATE", pan_direction="sway", is_dark=True)

print("All 6 CCTV MP4 videos generated successfully!")
