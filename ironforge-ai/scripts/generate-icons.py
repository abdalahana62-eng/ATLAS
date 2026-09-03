#!/usr/bin/env python3
"""
Generate Android mipmap icons from resources/icon.png
Creates ic_launcher.png and ic_launcher_round.png for all densities
"""
import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow not found, installing...")
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow", "-q"])
    from PIL import Image

# Config
SRC = Path("resources/icon.png")
ANDROID_RES = Path("android/app/src/main/res")

# Android mipmap densities
DENSITIES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

def main():
    if not SRC.exists():
        print(f"❌ Source not found: {SRC}")
        print("   Place your 1024x1024 icon at resources/icon.png")
        return False
    
    print(f"📱 Generating icons from {SRC}")
    img = Image.open(SRC).convert("RGBA")
    
    # Ensure square and resize with high quality
    for folder, size in DENSITIES.items():
        dest_dir = ANDROID_RES / folder
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        # Resize with LANCZOS
        resized = img.resize((size, size), Image.LANCZOS)
        
        # Save ic_launcher.png
        resized.save(dest_dir / "ic_launcher.png", "PNG")
        # Save ic_launcher_round.png (same for now, Android will mask)
        resized.save(dest_dir / "ic_launcher_round.png", "PNG")
        # Save ic_launcher_foreground.png for adaptive icon
        resized.save(dest_dir / "ic_launcher_foreground.png", "PNG")
        
        print(f"  ✓ {folder}: {size}x{size}")
    
    # Also copy to capacitor assets location for web
    print("✅ All icons generated!")
    return True

if __name__ == "__main__":
    main()
