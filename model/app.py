from flask import Flask, request, render_template, redirect, url_for
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import numpy as np
import os
from sklearn.metrics.pairwise import cosine_similarity

# Load the trained model
class Generator(nn.Module):
    def __init__(self):
        super(Generator, self).__init__()
        self.encoder = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=4, stride=2, padding=1),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(64, 128, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(128),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Conv2d(128, 256, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(256),
            nn.LeakyReLU(0.2, inplace=True),
        )
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(256, 128, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.ConvTranspose2d(128, 64, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.ConvTranspose2d(64, 3, kernel_size=4, stride=2, padding=1),
            nn.Tanh(),  # Output in range [-1, 1]
        )

    def forward(self, x):
        x = self.encoder(x)
        x = self.decoder(x)
        return x

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './static/uploads'
app.config['GENERATED_FOLDER'] = './static/generated'

# Ensure directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['GENERATED_FOLDER'], exist_ok=True)

# Load the generator model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
generator = Generator().to(device)
generator.load_state_dict(torch.load('./model/generator_model.pth', map_location=device))
generator.eval()

# Image transformation for generation
transform = transforms.Compose([ 
    transforms.Resize((200, 200)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

# Pre-trained model for feature extraction (ResNet-18)
feature_model = models.resnet18(pretrained=True)
feature_model.eval()

# Image transformation for feature extraction
transform_for_feature = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Function to extract feature vector
def extract_feature(image_path):
    image = Image.open(image_path).convert("RGB")
    image_tensor = transform_for_feature(image).unsqueeze(0)
    with torch.no_grad():
        feature_vector = feature_model(image_tensor).squeeze()
    return feature_vector.numpy()

# Create a database of kid actors
def create_kid_actor_database(kid_actors_folder):
    kid_actors_data = []
    for filename in os.listdir(kid_actors_folder):
        if filename.endswith(".jpg") or filename.endswith(".png"):
            image_path = os.path.join(kid_actors_folder, filename)
            feature_vector = extract_feature(image_path)
            name = filename.split('.')[0]  # Assuming the filename is the kid actor's name
            kid_actors_data.append((name, feature_vector, image_path))
    return kid_actors_data

# Function to find the top 3 most similar kid actors based on the generated image
def find_top_3_matches(generated_image_path, kid_actors_data):
    generated_feature = extract_feature(generated_image_path)
    similarities = []

    for name, feature_vector, image_path in kid_actors_data:
        similarity = cosine_similarity([generated_feature], [feature_vector])[0][0]
        similarities.append((name, similarity, image_path))

    similarities.sort(key=lambda x: x[1], reverse=True)
    top_3_matches = similarities[:3]
    return top_3_matches

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return redirect(url_for('index'))

    file = request.files['image']
    if file.filename == '':
        return redirect(url_for('index'))

    # Save uploaded image
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(input_path)

    # Generate child image
    generated_image = generate_child_image(input_path)
    generated_image_path = os.path.join(app.config['GENERATED_FOLDER'], f"generated_{file.filename}")
    Image.fromarray(generated_image).save(generated_image_path)

    # Load kid actor database (assuming it's in 'static/kid_version' directory)
    kid_actors_folder = './static/kid_version'
    kid_actors_data = create_kid_actor_database(kid_actors_folder)

    # Find the top 3 matching kid actors
    top_3_matches = find_top_3_matches(generated_image_path, kid_actors_data)

    # Render the result
    return render_template('result.html', input_image=input_path, generated_image=generated_image_path, top_3_matches=top_3_matches)

# Function to generate child image
def generate_child_image(image_path):
    try:
        image = Image.open(image_path).convert('RGB')
    except Exception as e:
        return f"Error processing image: {str(e)}", 500

    input_tensor = transform(image).unsqueeze(0).to(device)
    
    # Generate child version
    with torch.no_grad():
        generated_tensor = generator(input_tensor)
        generated_image = generated_tensor.squeeze(0).cpu().numpy()
        generated_image = (generated_image * 0.5) + 0.5  # Denormalize
        generated_image = np.transpose(generated_image, (1, 2, 0))  # CxHxW -> HxWxC

    return (generated_image * 255).astype(np.uint8)

if __name__ == '__main__':
    app.run(port=5000, debug=True, host='0.0.0.0')
