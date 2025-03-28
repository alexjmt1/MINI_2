import os

class Config:
    # Gemini API Configuration
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "your_api_key_here")
    
    # Offline NLP Settings
    OFFLINE_FEATURES_ENABLED = True
    LOCAL_MODEL_PATH = "models/local_nlp_model"
    
    # Pretrained Queries
    COMMON_QUERIES = {
        "hello": "Hello! I'm your Python tutor. How can I help you today?",
        "help": "I can help with:\n- Python concepts\n- Code debugging\n- Error explanations\n- Code generation",
        "basics": "Python basics include:\n1. Variables\n2. Data types\n3. Control structures\n4. Functions\n5. Modules",
    }
