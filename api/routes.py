from app import app

@app.route('/api/login')
def login():
  pass

@app.route('/api/field', methods=['POST', 'GET'])
def field():
  pass

@app.route('/api/forecast')
def forecast():
  pass