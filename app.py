from flask import Flask, render_template, request, jsonify
from config import Config
from nlp.offline_processor import OfflineProcessor
from nlp.pretrained_queries import get_pretrained_response
import google.generativeai as genai

app = Flask(__name__)
app.config.from_object(Config)

# Initialize Gemini
genai.configure(api_key=app.config['GOOGLE_API_KEY'])
model = genai.GenerativeModel('gemini-pro')

# Initialize offline processor
offline_processor = OfflineProcessor()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '').lower().strip()
    
    # First check pretrained queries
    pretrained_response = get_pretrained_response(user_message)
    if pretrained_response:
        return jsonify({'response': pretrained_response, 'source': 'local'})
    
    # Then try offline processing
    if app.config['OFFLINE_FEATURES_ENABLED']:
        offline_response = offline_processor.process(user_message)
        if offline_response:
            return jsonify({'response': offline_response, 'source': 'local'})
    
    # Fall back to Gemini API
    try:
        response = model.generate_content(
            f"You are a Python tutor. Answer this question: {user_message}"
        )
        return jsonify({
            'response': response.text,
            'source': 'gemini'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
