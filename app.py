from flask import Flask, render_template, request
import torch
from PIL import Image
import torchvision.transforms as transforms
from model.generator import Generator

app = Flask(__name__)

# Load the generator model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
generator = Generator().to(device)
generator.load_state_dict(torch.load("model/generator_model.pth", map_location=device), strict=False)
generator.eval()

# Transformation for input images
transform = transforms.Compose([
    transforms.Resize((200, 200)),  # Resize to match your model input
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),  # Normalize to [-1, 1]
])

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    if "image" not in request.files:
        return "No file uploaded!", 400

    file = request.files["image"]
    image = Image.open(file).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(device)

    # Generate child image
    with torch.no_grad():
        generated_tensor = generator(input_tensor)
    generated_tensor = generated_tensor.squeeze(0).cpu()
    generated_image = (generated_tensor.permute(1, 2, 0).numpy() * 0.5) + 0.5  # Denormalize

    # Save the generated image
    generated_image_path = "static/generated_image.png"
    Image.fromarray((generated_image * 255).astype("uint8")).save(generated_image_path)

    return render_template("result.html", input_image=file.filename, output_image="generated_image.png")

if __name__ == "__main__":
    app.run(debug=True)
