# chat.py
import os
import logging
import redis
import gevent
from flask import Flask, render_template
from flask_sockets import Sockets
import json


REDIS_URL = os.environ['REDIS_URL']
REDIS_CHAN = 'chat'

app = Flask(__name__)
app.debug = 'DEBUG' in os.environ

sockets = Sockets(app)
redis = redis.from_url(REDIS_URL)

class ChatBackend(object):
    """Interface for registering and updating WebSocket clients."""

    def __init__(self):
        self.clients = list()
        self.pubsub = redis.pubsub()
        self.pubsub.subscribe(REDIS_CHAN)

    def __iter_data(self):
        for message in self.pubsub.listen():
           data = message.get('data')
           if message['type'] == 'message':
               app.logger.info(u'Sending message: {}'.format(data))
               json_data = json.loads(data)
               yield json.dumps(json_data)

    def register(self, client):
        """Register a WebSocket connection for Redis updates."""
        self.clients.append(client)

    def send(self, client, data):
        """Send given data to the registered client.
        Automatically discards invalid connections."""
        try:
            client.send(data)
        except Exception:
            self.clients.remove(client)

    def run(self):
        """Listens for new messages in Redis, and sends them to clients."""
        for data in self.__iter_data():
            for client in self.clients:
                gevent.spawn(self.send, client, data)

    def start(self):
        """Maintains Redis subscription in the background."""
        gevent.spawn(self.run)



chats = ChatBackend()
chats.start()

""" set up routes for all pages"""
@app.route('/')
def start():
    return render_template('start.html')

@app.route('/pie_Chart')
def pie_Chart():
    return render_template('pieChart.html')

@app.route('/bar_Chart')
def bar_Chart():
    return render_template('creative.html')

@app.route('/websocket_chat')
def websocket_chat():
    return render_template('websocket.html')

@app.route('/report')
def report():
    return render_template('report.html')


@sockets.route('/submit')
def inbox(ws):
    """Receives incoming chat messages, inserts them into Redis."""
    while not ws.closed:
        # Sleep to prevent *contstant* context-switches.
        gevent.sleep(0.1)
        message = ws.receive()

        if message:
            app.logger.info(u'Inserting message: {}'.format(message))
            redis.publish(REDIS_CHAN, message)


@sockets.route('/receive')
def outbox(ws):
    """Sends outgoing chat messages, via `ChatBackend`."""
    chats.register(ws)

    while not ws.closed:
        # Context switch while `ChatBackend.start` is running in the background.
        gevent.sleep(0.1)
