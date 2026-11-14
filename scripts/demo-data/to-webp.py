"""Converts the dashboard captures to the WebP files the marketing site serves.

Run from the repo root with Pillow installed: python3 scripts/demo-data/to-webp.py
"""

import glob
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PUBLIC = os.path.join(ROOT, "apps", "www", "public")


def save(image, path, quality=84):
    image.convert("RGB").save(path, "WEBP", quality=quality, method=6)


# Whole-screen captures: 3000x1800 masters served at 1600 and 800 wide.
for master in glob.glob(os.path.join(PUBLIC, "screenshots", "*.png")):
    stem = master[:-4]
    image = Image.open(master)
    save(image.resize((1600, 960), Image.LANCZOS), stem + ".webp", quality=82)
    save(image.resize((800, 480), Image.LANCZOS), stem + "-800.webp", quality=82)

# Crops: captured at twice their displayed size, served at that size and at half of it.
os.makedirs(os.path.join(PUBLIC, "screens"), exist_ok=True)
for master in glob.glob(os.path.join(ROOT, "scripts", "demo-data", "captures", "*.png")):
    name = os.path.basename(master)[:-4]
    image = Image.open(master)
    save(image, os.path.join(PUBLIC, "screens", name + "-2x.webp"))
    half = (image.width // 2, image.height // 2)
    save(image.resize(half, Image.LANCZOS), os.path.join(PUBLIC, "screens", name + ".webp"))
