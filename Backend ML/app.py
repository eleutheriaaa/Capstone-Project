from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import os

app = Flask(__name__)
CORS(app)
model = tf.keras.models.load_model('model_skin_disease.h5')

class_names = [
    'Acne',
    'Actinic_Keratosis',
    'Benign_tumors',
    'Bullous',
    'Candidiasis',
    'DrugEruption',
    'Eczema',
    'Infestations_Bites',
    'Lichen',
    'Lupus',
    'Moles',
    'Psoriasis',
    'Rosacea',
    'Seborrh_Keratoses',
    'SkinCancer',
    'Sun_Sunlight_Damage',
    'Tinea',
    'Unknown_Normal',
    'Vascular_Tumors',
    'Vasculitis',
    'Vitiligo',
    'Warts'
]

def predict_skin_disease_from_file(file_storage):
    img = Image.open(file_storage).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img)

    # ✅ Gunakan preprocessing yang sama dengan training
    img_array = preprocess_input(img_array)

    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    predicted_class = class_names[np.argmax(predictions)]
    confidence = float(np.max(predictions))

    return predicted_class, confidence

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        label, confidence = predict_skin_disease_from_file(file)
        return jsonify({'predicted_class': label, 'confidence': f"{confidence * 100:.2f}%"})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)