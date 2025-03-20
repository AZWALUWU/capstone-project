from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from ml_model import HealthRecommendationModel

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize and load the model
model = HealthRecommendationModel()
model_loaded = False

# Try to load the pre-trained model
if os.path.exists("model.joblib"):
    model_loaded = model.load_model("model.joblib")
else:
    # If no pre-trained model exists, train a new one if the dataset exists
    if os.path.exists("dataset_penyakit_10000_cleaned.csv"):
        model.load_and_prepare_data("dataset_penyakit_10000_cleaned.csv")
        model.train_model()
        model.save_model("model.joblib")
        model_loaded = True

# Mock data for when the model is not available
mock_diagnoses = {
    "fever+moderate+4_7_days": {
        "condition": "Influenza",
        "description": "Infeksi virus yang menyerang sistem pernapasan Anda. Gejala umum termasuk demam, nyeri tubuh, dan kelelahan.",
        "confidence": 0.85,
        "firstAid": [
            "Istirahat dan tetap terhidrasi",
            "Minum obat penurun demam yang dijual bebas",
            "Gunakan humidifier untuk meredakan hidung tersumbat",
            "Konsultasikan dengan dokter jika gejala memburuk",
        ],
    },
    "headache+severe+more_than_week": {
        "condition": "Migrain",
        "description": "Sakit kepala dengan intensitas bervariasi, sering disertai mual dan sensitivitas terhadap cahaya dan suara.",
        "confidence": 0.78,
        "firstAid": [
            "Beristirahat di ruangan yang tenang dan gelap",
            "Aplikasikan kompres dingin pada dahi Anda",
            "Coba pereda nyeri yang dijual bebas",
            "Tetap terhidrasi",
            "Konsultasikan dengan dokter untuk migrain berulang",
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
    "condition": "Ketidaknyamanan Umum",
    "description": "Gejala Anda menunjukkan ketidaknyamanan umum yang mungkin terkait dengan berbagai faktor termasuk stres, penyakit ringan, atau faktor gaya hidup.",
    "confidence": 0.65,
    "firstAid": [
        "Istirahat dan pantau gejala Anda",
        "Tetap terhidrasi",
        "Konsultasikan dengan profesional kesehatan jika gejala berlanjut atau memburuk",
    ],
}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "message": "API is running",
        "model_loaded": model_loaded,
        "model_accuracy": model.accuracy if model_loaded else None
    })

@app.route('/api/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    
    if model_loaded:
        # Use the trained model for prediction
        result = model.predict({
            "symptom": data.get("symptom"),
            "severity": data.get("severity"),
            "duration": data.get("duration")
        })
        
        if "error" in result:
            return jsonify({"error": result["error"]}), 400
            
        # Format the response
        response = {
            "condition": result["condition"],
            "description": f"Based on your symptoms, you may have {result['condition']}.",
            "confidence": result["confidence"],
            "firstAid": get_first_aid_recommendations(result["condition"])
        }
        
        return jsonify(response)
    else:
        # Use mock data if model is not available
        key = f"{data.get('symptom')}+{data.get('severity')}+{data.get('duration')}"
        result = mock_diagnoses.get(key, default_diagnosis)
        
        return jsonify(result)

@app.route('/api/feature-options', methods=['GET'])
def get_feature_options():
    if model_loaded:
        return jsonify(model.get_feature_options())
    else:
        # Return mock options if model is not available
        return jsonify({
            "symptom": ["fever", "cough", "headache", "fatigue", "nausea", "dizziness", "sore_throat", "chest_pain"],
            "severity": ["mild", "moderate", "severe"],
            "duration": ["less_than_day", "1_3_days", "4_7_days", "more_than_week"]
        })

def get_first_aid_recommendations(condition):
    """Return first aid recommendations based on the condition"""
    # This would ideally come from a database or more sophisticated source
    recommendations = {
        "Influenza": [
            "Istirahat dan tetap terhidrasi",
            "Minum obat penurun demam yang dijual bebas",
            "Gunakan humidifier untuk meredakan hidung tersumbat",
            "Konsultasikan dengan dokter jika gejala memburuk",
        ],
        "Migrain": [
            "Beristirahat di ruangan yang tenang dan gelap",
            "Aplikasikan kompres dingin pada dahi Anda",
            "Coba pereda nyeri yang dijual bebas",
            "Tetap terhidrasi",
            "Konsultasikan dengan dokter untuk migrain berulang",
        ],
        # Add more conditions and recommendations as needed
    }
    
    return recommendations.get(condition, [
        "Istirahat dan pantau gejala Anda",
        "Tetap terhidrasi",
        "Konsultasikan dengan profesional kesehatan"
    ])

@app.route('/api/posts', methods=['GET'])
def get_posts():
    # Mock blog posts
    posts = [
        {
            "id": 1,
            "title": "Memahami Gejala Flu Biasa",
            "excerpt": "Pelajari tentang gejala umum flu dan cara mengobatinya secara efektif.",
            "content": "<p>Flu biasa adalah infeksi virus pada hidung dan tenggorokan Anda...</p>",
            "category": "Tips Kesehatan",
            "image_url": "/placeholder.svg?height=400&width=800&text=Flu+Biasa",
            "created_at": "2023-01-15T12:00:00Z"
        },
        {
            "id": 2,
            "title": "Pertolongan Pertama untuk Luka Bakar Ringan",
            "excerpt": "Panduan untuk menangani luka bakar ringan di rumah dan kapan harus mencari perhatian medis.",
            "content": "<p>Luka bakar diklasifikasikan berdasarkan tingkat keparahannya...</p>",
            "category": "Pertolongan Pertama",
            "image_url": "/placeholder.svg?height=400&width=800&text=Luka+Bakar",
            "created_at": "2023-02-10T14:30:00Z"
        }
    ]
    
    return jsonify({"posts": posts, "total": len(posts)})

@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    # Mock single post
    post = {
        "id": post_id,
        "title": "Memahami Gejala Flu Biasa" if post_id == 1 else "Pertolongan Pertama untuk Luka Bakar Ringan",
        "excerpt": "Pelajari tentang gejala umum flu dan cara mengobatinya secara efektif.",
        "content": "<p>Flu biasa adalah infeksi virus pada hidung dan tenggorokan Anda...</p>",
        "category": "Tips Kesehatan" if post_id == 1 else "Pertolongan Pertama",
        "image_url": f"/placeholder.svg?height=400&width=800&text=Post+{post_id}",
        "created_at": "2023-01-15T12:00:00Z"
    }
    
    return jsonify(post)

@app.route('/api/model-info', methods=['GET'])
def get_model_info():
    if model_loaded:
        return jsonify({
            "accuracy": model.accuracy,
            "most_important_feature": model.most_important_feature,
            "features": list(model.cat_value_dicts.keys()),
            "target": model.final_colname
        })
    else:
        return jsonify({
            "error": "Model not loaded",
            "accuracy": None,
            "most_important_feature": None
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

