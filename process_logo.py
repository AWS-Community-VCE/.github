from PIL import Image
import sys

try:
    img = Image.open('logo.png').convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # If white or close to white, make transparent
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    
    # Get bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        # Add a tiny bit of padding (e.g. 5px) if possible
        x1, y1, x2, y2 = bbox
        x1 = max(0, x1 - 5)
        y1 = max(0, y1 - 5)
        x2 = min(img.width, x2 + 5)
        y2 = min(img.height, y2 + 5)
        img = img.crop((x1, y1, x2, y2))
        
    img.save('logo.png', "PNG")
    print("Successfully processed logo.png")
except Exception as e:
    print(f"Error: {e}")
