from flask import Flask, request, jsonify
from flask_cors import CORS
import kociemba
import time

app = Flask(__name__)
# Enable CORS with explicit configuration
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3001", "http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False
    }
})

# Standard color mapping
COLORS = {'U', 'R', 'F', 'D', 'L', 'B'}

def validate_cube_string(cube_string):
    """
    Validate the cube string format and state.
    Returns (is_valid, error_message)
    """
    if not cube_string:
        return False, "Cube string is empty"
    
    if len(cube_string) != 54:
        return False, f"Cube string must be exactly 54 characters, got {len(cube_string)}"
    
    # Check all characters are valid colors
    invalid_chars = set(cube_string) - COLORS
    if invalid_chars:
        return False, f"Invalid color characters: {invalid_chars}. Valid colors are: {COLORS}"
    
    # Check color counts (should be 9 of each color)
    from collections import Counter
    color_counts = Counter(cube_string)
    expected_count = 9
    
    for color in COLORS:
        if color_counts[color] != expected_count:
            return False, f"Color '{color}' appears {color_counts[color]} times, expected {expected_count}"
    
    return True, None

@app.route('/solve', methods=['POST'])
def solve_cube():
    """
    Solve a Rubik's Cube using the Kociemba algorithm.
    
    Request body:
    {
        "cubeString": "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
    }
    
    Response (success):
    {
        "solution": "R U R' U R U2 R'",
        "moves": 8,
        "time": 0.05
    }
    
    Response (error):
    {
        "error": "Invalid cube string",
        "details": "..."
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'cubeString' not in data:
            return jsonify({
                "error": "Invalid request",
                "details": "Missing 'cubeString' field in request body"
            }), 400
        
        cube_string = data['cubeString']
        
        # Validate the cube string
        is_valid, error_message = validate_cube_string(cube_string)
        if not is_valid:
            return jsonify({
                "error": "Invalid cube string",
                "details": error_message
            }), 400
        
        # Solve using Kociemba algorithm
        start_time = time.time()
        try:
            solution = kociemba.solve(cube_string)
            solve_time = time.time() - start_time
            
            # Count moves (split by spaces, handle prime and 2 notation)
            moves = len(solution.split()) if solution else 0
            
            return jsonify({
                "solution": solution,
                "moves": moves,
                "time": round(solve_time, 3)
            }), 200
            
        except ValueError as e:
            # Kociemba may raise ValueError for unsolvable states
            error_msg = str(e)
            # Provide more helpful error message
            if "invalid" in error_msg.lower() or "cubestring" in error_msg.lower():
                return jsonify({
                    "error": "Invalid cube state",
                    "details": "The cube state is physically impossible. Make sure each color appears exactly 9 times and the cube state is valid (e.g., not all one color, follows Rubik's Cube parity rules)."
                }), 400
            return jsonify({
                "error": "Cube solving failed",
                "details": error_msg
            }), 400
            
    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)

