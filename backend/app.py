from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
# In a real app, you would load your trained model here
# model = joblib.load('model.pkl')

# Mock data for development
mock_diagnoses = {
    "fever+moderate+4_7_days": {
        "condition": "Influenza",
        "description": "A viral infection that attacks your respiratory system. Common symptoms include fever, body aches, and fatigue.",
        "confidence": 0.85,
        "firstAid": [
            "Rest and stay hydrated",
            "Take over-the-counter fever reducers",
            "Use a humidifier to ease congestion",
            "Consult a doctor if symptoms worsen",
        ],
    },
    "headache+severe+more_than_week": {
        "condition": "Migraine",
        "description": "A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.",
        "confidence": 0.78,
        "firstAid": [
            "Rest in a quiet, dark room",
            "Apply cold compresses to your forehead",
            "Try over-the-counter pain relievers",
            "Stay hydrated",
            "Consult a doctor for recurring migraines",
        ],
    },
    "cough+moderate+1_3_days": {
        "condition": "Common Cold",
        "description": "A viral infection of your nose and throat. It's usually harmless, although it might not feel that way.",
        "confidence": 0.82,
        "firstAid": [
            "Get plenty of rest",
            "Drink fluids to prevent dehydration",
            "Use over-the-counter cold medications",
            "Try honey for cough relief",
        ],
    },
    "fatigue+mild+more_than_week": {
        "condition": "Chronic Fatigue",
        "description": "Extreme fatigue that can't be explained by an underlying medical condition.",
        "confidence": 0.65,
        "firstAid": [
            "Establish a regular sleep schedule",
            "Pace yourself during activities",
            "Avoid caffeine, alcohol, and nicotine",
            "Consider speaking with a healthcare provider",
        ],
    },
}

# Default diagnosis
default_diagnosis = {
    "condition": "General Discomfort",
    "description": "Your symptoms suggest a general discomfort that could be related to various factors including stress, minor illness, or lifestyle factors.",
    "confidence": 0.65,
    "firstAid": [
        "Rest and monitor your symptoms",
        "Stay hydrated",
        "Consult a healthcare professional if symptoms persist or worsen",
    ],
}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "API is running"})

@app.route('/api/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    
    # In a real app, you would use your ML model to make a prediction
    # features = preprocess_input(data)
    # prediction = model.predict(features)
    # result = format_prediction(prediction)
    
    # For development, use mock data
    key = f"{data.get('symptom')}+{data.get('severity')}+{data.get('duration')}"
    result = mock_diagnoses.get(key, default_diagnosis)
    
    return jsonify(result)

@app.route('/api/posts', methods=['GET'])
def get_posts():
    # Mock blog posts
    posts = [
        {
            "id": 1,
            "title": "Understanding Common Cold Symptoms",
            "excerpt": "Learn about the common symptoms of a cold and how to treat them effectively.",
            "content": "<p>The common cold is a viral infection of your nose and throat...</p>",
            "category": "Health Tips",
            "image_url": "/placeholder.svg?height=400&width=800&text=Common+Cold",
            "created_at": "2023-01-15T12:00:00Z"
        },
        {
            "id": 2,
            "title": "First Aid for Minor Burns",
            "excerpt": "A guide to treating minor burns at home and when to seek medical attention.",
            "content": "<p>Burns are classified by their severity...</p>",
            "category": "First Aid",
            "image_url": "/placeholder.svg?height=400&width=800&text=Burns",
            "created_at": "2023-02-10T14:30:00Z"
        }
    ]
    
    return jsonify({"posts": posts, "total": len(posts)})

@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    # Mock single post
    post = {
        "id": post_id,
        "title": "Understanding Common Cold Symptoms" if post_id == 1 else "First Aid for Minor Burns",
        "excerpt": "Learn about the common symptoms of a cold and how to treat them effectively.",
        "content": "<p>The common cold is a viral infection of your nose and throat...</p>",
        "category": "Health Tips" if post_id == 1 else "First Aid",
        "image_url": f"/placeholder.svg?height=400&width=800&text=Post+{post_id}",
        "created_at": "2023-01-15T12:00:00Z"
    }
    
    return jsonify(post)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

