from ml_model import HealthRecommendationModel
import os

def main():
    print("Starting model training...")
    
    # Check if dataset exists
    if not os.path.exists("dataset_penyakit_10000_cleaned.csv"):
        print("Dataset not found. Please place 'dataset_penyakit_10000_cleaned.csv' in the current directory.")
        return
    
    # Initialize and train the model
    model = HealthRecommendationModel("dataset_penyakit_10000_cleaned.csv")
    
    # Save the trained model
    if model.save_model("model.joblib"):
        print(f"Model trained successfully with {model.accuracy}% accuracy.")
        print(f"Most important feature: {model.most_important_feature}")
        print("Model saved to 'model.joblib'")
    else:
        print("Failed to save model.")

if __name__ == "__main__":
    main()

