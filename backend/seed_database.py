import pandas as pd
import numpy as np
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)

def seed_database():
  print("Starting database seeding...")
  
  try:
      # Load dataset
      data = pd.read_csv('dataset_penyakit_10000_cleaned.csv')
      print(f"Loaded dataset with {len(data)} rows and {len(data.columns)} columns")
      
      # Get unique conditions (last column)
      conditions = data.iloc[:, -1].unique()
      print(f"Found {len(conditions)} unique health conditions")
      
      # Create guides for each condition
      guides = []
      for i, condition in enumerate(conditions):
          # Create a guide for each condition
          guide = {
              'title': f"Understanding and Managing {condition}",
              'description': f"A comprehensive guide to understanding, identifying, and managing {condition}.",
              'content': json.dumps({
                  'steps': [
                      {
                          'title': f"Recognizing {condition}",
                          'content': "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies."
                      },
                      {
                          'title': "When to Seek Medical Help",
                          'content': "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies."
                      },
                      {
                          'title': "Home Management",
                          'content': "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies."
                      },
                      {
                          'title': "Prevention Tips",
                          'content': "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies."
                      }
                  ],
                  'tips': [
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                      "Nullam euismod, nisl eget aliquam ultricies.",
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                      "Nullam euismod, nisl eget aliquam ultricies."
                  ],
                  'warnings': [
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                      "Nullam euismod, nisl eget aliquam ultricies."
                  ]
              }),
              'category': 'Health Condition' if i % 3 == 0 else ('First Aid' if i % 3 == 1 else 'Preventive Care'),
              'difficulty': 'Beginner' if i % 3 == 0 else ('Intermediate' if i % 3 == 1 else 'Advanced'),
              'time': f"{(i % 5) * 5 + 5} minutes",
              'image_url': f"/placeholder.svg?height=400&width=800&text={condition}"
          }
          guides.append(guide)
      
      # Insert guides into database
      guides_df = pd.DataFrame(guides)
      guides_df.to_sql('guides', engine, if_exists='append', index=False)
      print(f"Inserted {len(guides)} guides into the database")
      
      print("Database seeding completed successfully!")
      
  except Exception as e:
      print(f"Error seeding database: {e}")

if __name__ == "__main__":
  seed_database()

