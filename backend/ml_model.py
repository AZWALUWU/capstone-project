import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import joblib
import os

class HealthRecommendationModel:
    def __init__(self, data_path=None):
        self.model = None
        self.cat_value_dicts = {}
        self.final_colname = None
        self.data = None
        self.accuracy = None
        self.most_important_feature = None
        
        if data_path and os.path.exists(data_path):
            self.load_and_prepare_data(data_path)
            self.train_model()
    
    def load_and_prepare_data(self, data_path):
        # Load dataset
        uncleaned_data = pd.read_csv(data_path)
        self.data = pd.DataFrame()
        
        # Keep track of categorical columns and their mappings
        self.final_colname = uncleaned_data.columns[len(uncleaned_data.columns) - 1]
        
        # For each column...
        for colname, colval in uncleaned_data.iteritems():
            # Check if column is already numeric
            if isinstance(colval.values[0], (np.integer, float)):
                self.data[colname] = uncleaned_data[colname].copy()
                continue
                
            # Handle categorical values
            new_dict = {}
            val = 0  # First index per column
            transformed_col_vals = []  # New numeric datapoints
            
            # For each item in the column...
            for row, item in enumerate(colval.values):
                # If item is not in this column's dictionary...
                if item not in new_dict:
                    new_dict[item] = val
                    val += 1
                
                # Add numerical value to transformed dataframe
                transformed_col_vals.append(new_dict[item])
            
            # Reverse dictionary only for final column (0, 1) => (vals)
            if colname == self.final_colname:
                new_dict = {value: key for key, value in new_dict.items()}
                
            self.cat_value_dicts[colname] = new_dict
            self.data[colname] = transformed_col_vals
    
    def train_model(self):
        # Select features and prediction; automatically selects last column as prediction
        cols = len(self.data.columns)
        num_features = cols - 1
        x = self.data.iloc[:, :num_features]
        y = self.data.iloc[:, num_features:]
        
        # Split data into training and testing sets
        x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.25, random_state=42)
        
        # Train the model
        self.model = LogisticRegression(max_iter=1000)
        self.model.fit(x_train, y_train.values.ravel())
        
        # Evaluate the model
        y_pred = self.model.predict(x_test)
        from sklearn import metrics
        self.accuracy = round(metrics.accuracy_score(y_test, y_pred) * 100, 1)
        
        # Find most important feature
        self.most_important_feature = self.get_most_important_feature()
    
    def get_most_important_feature(self):
        if self.model is None:
            return None
            
        feats = [abs(x) for x in self.model.coef_[0]]
        max_val = max(feats)
        idx = feats.index(max_val)
        return self.data.columns[idx]
    
    def predict(self, features_dict):
        if self.model is None:
            return {"error": "Model not trained"}
            
        features = []
        
        # Transform categorical input
        for colname in self.data.columns:
            # Skip the target column
            if colname == self.final_colname:
                continue
                
            if colname in features_dict:
                value = features_dict[colname]
                
                # Handle categorical features
                if colname in self.cat_value_dicts:
                    if value in self.cat_value_dicts[colname]:
                        features.append(self.cat_value_dicts[colname][value])
                    else:
                        return {"error": f"Invalid value for {colname}: {value}"}
                else:
                    # Numeric feature
                    features.append(float(value))
            else:
                return {"error": f"Missing feature: {colname}"}
        
        # Predict
        new_input = [features]
        result = self.model.predict(new_input)
        confidence = max(self.model.predict_proba(new_input)[0])
        
        return {
            "condition": self.cat_value_dicts[self.final_colname][result[0]],
            "confidence": round(confidence, 2),
            "accuracy": self.accuracy,
            "most_important_feature": self.most_important_feature
        }
    
    def save_model(self, model_path="model.joblib"):
        if self.model is None:
            return False
            
        model_data = {
            "model": self.model,
            "cat_value_dicts": self.cat_value_dicts,
            "final_colname": self.final_colname,
            "accuracy": self.accuracy,
            "most_important_feature": self.most_important_feature
        }
        
        joblib.dump(model_data, model_path)
        return True
    
    def load_model(self, model_path="model.joblib"):
        if not os.path.exists(model_path):
            return False
            
        model_data = joblib.load(model_path)
        
        self.model = model_data["model"]
        self.cat_value_dicts = model_data["cat_value_dicts"]
        self.final_colname = model_data["final_colname"]
        self.accuracy = model_data["accuracy"]
        self.most_important_feature = model_data["most_important_feature"]
        
        return True
    
    def get_feature_options(self):
        """Return all possible options for categorical features"""
        options = {}
        
        for colname, value_dict in self.cat_value_dicts.items():
            # Skip the target column
            if colname == self.final_colname:
                continue
                
            options[colname] = list(value_dict.keys())
            
        return options

