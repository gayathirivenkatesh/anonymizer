from PIL import Image
import io

def anonymize_metadata(file_bytes: bytes):
    input_io = io.BytesIO(file_bytes)
    img = Image.open(input_io)

    # Create a new clean image without EXIF
    data = list(img.getdata())
    img_no_exif = Image.new(img.mode, img.size)
    img_no_exif.putdata(data)

    # Save into BytesIO without EXIF
    output_io = io.BytesIO()
    img_no_exif.save(output_io, format=img.format)

    # Return anonymized image + list of removed fields
    removed = list(img.info.keys())  # whatever metadata was originally in .info
    return output_io, removed
