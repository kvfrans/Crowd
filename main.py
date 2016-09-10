from sample import *
import bottle
from bottle import route, run, template, static_file, get, post, request, response

servants_connected = 0

@post("/servant_connect")
def servant_connect():
    global servants_connected
    servants_connected += 1

@post("/servant_disconnect")
def servant_disconnect():
    global servants_connected
    servants_connected -= 1

@post("/client_request")
def client_request():
    input_size = request.forms.get('input_size')
    hidden_size = request.forms.get('hidden_size')
    output_size = request.forms.get('output_size')
