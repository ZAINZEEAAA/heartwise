document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        resultDiv.innerHTML = '<div class="loading">Processing...</div>';
        
        try {
            const formData = new FormData(form);
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Calculate risk level
                let riskLevel;
                const probability = data.probability * 100;
                
                if (probability < 25) {
                    riskLevel = "Low Risk";
                } else if (probability < 50) {
                    riskLevel = "Moderate Risk";
                } else if (probability < 75) {
                    riskLevel = "High Risk";
                } else {
                    riskLevel = "Very High Risk";
                }
                
                // Display results
                resultDiv.innerHTML = `
                    <div class="result-box ${data.prediction === 1 ? 'risk' : 'no-risk'}">
                        <h2>Prediction Results</h2>
                        <p class="prediction-text">
                            ${data.prediction === 1 ? 
                                'Potential heart disease detected' : 
                                'No heart disease detected'}
                        </p>
                        <p class="probability">
                            Risk Level: ${riskLevel} (${probability.toFixed(2)}%)
                        </p>
                        <div class="recommendations">
                            <h3>Recommendations:</h3>
                            <p>${data.recommendations}</p>
                        </div>
                        <p class="disclaimer">
                            This is an AI-powered prediction. Please consult with a healthcare professional for proper medical advice.
                        </p>
                    </div>
                `;
            } else {
                throw new Error(data.error || 'Prediction failed');
            }
        } catch (error) {
            resultDiv.innerHTML = `
                <div class="error-box">
                    <p>Error: ${error.message}</p>
                    <p>Please try again or contact support if the problem persists.</p>
                </div>
            `;
        }
    });
});