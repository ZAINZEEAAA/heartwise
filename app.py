from flask import Flask, request, render_template, jsonify
import numpy as np
import joblib
import os

app = Flask(__name__, static_url_path='/static', static_folder='static')

# Load the model and scaler
model = joblib.load('xgboost_heart_model.joblib')
scaler = joblib.load('scaler.joblib')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    if filename.endswith('.html'):
        return render_template(filename)
    return app.send_static_file(filename)

def get_recommendations(data):
    # Add your recommendation logic here
    return "Based on the prediction, please consult with a healthcare professional for proper medical advice."

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from the form
        data = request.form.to_dict()
        
        # Convert form data to float/int
        features = np.array([
            float(data.get('age', 0)),
            float(data.get('sex', 0)),
            float(data.get('cp', 0)),
            float(data.get('trestbps', 0)),
            float(data.get('chol', 0)),
            float(data.get('fbs', 0)),
            float(data.get('restecg', 0)),
            float(data.get('thalach', 0)),
            float(data.get('exang', 0)),
            float(data.get('oldpeak', 0)),
            float(data.get('slope', 0)),
            float(data.get('ca', 0)),
            float(data.get('thal', 0))
        ]).reshape(1, -1)

        # Scale the features
        features_scaled = scaler.transform(features)
        
        # Make prediction
        prediction = model.predict(features_scaled)
        probability = model.predict_proba(features_scaled)[0][1]
        
        # Get recommendations
        recommendations = get_recommendations(data)
        
        return jsonify({
            'prediction': int(prediction[0]),
            'probability': float(probability),
            'recommendations': recommendations
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True) 
