import time
from flask import Flask

app = Flask(__name__)


@app.route('/hi')
def get_current_time():
    return {'hello': 'peter'}
