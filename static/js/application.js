// Support TLS-specific URLs, when appropriate.
if (window.location.protocol == "https:") {
  var ws_scheme = "wss://";
} else {
  var ws_scheme = "ws://"
};

//open websocket connections to the server so the browser can send and receive messages 
var inbox = new ReconnectingWebSocket(ws_scheme + location.host + "/receive");
var outbox = new ReconnectingWebSocket(ws_scheme + location.host + "/submit");

//recieve the the username(handle) and the message(data) and display on the the div container(#chat-text)
inbox.onmessage = function(message) {
  //Validae server data by checking if message.data is a JSON string otherwise display error message in console  
  try{
  var data = JSON.parse(message.data);
  $("#chat-text").append("<div class='panel panel-default'><div class='panel-heading'>" + $('<span/>').text(data.handle).html() + "</div><div class='panel-body'>" + $('<span/>').text(data.text).html() + "</div></div>");
  $("#chat-text").stop().animate({
    scrollTop: $('#chat-text')[0].scrollHeight
  }, 800);
}
  catch (e) {  
  console.log('Security block, sever data is not JSON, Data is not received');
}

};


inbox.onclose = function(){
    console.log('inbox closed');
    this.inbox = new WebSocket(inbox.url);

};

outbox.onclose = function(){
    console.log('outbox closed');
    this.outbox = new WebSocket(outbox.url);
};

//send messages to the server as a key value pair handle = user, text = message
$("#input-form").on("submit", function(event) {
  event.preventDefault();
  var handle = $("#input-handle")[0].value;
  var text   = $("#input-text")[0].value;
  console.log($("#input-handle")[0].value)
  //Validate client input so only cetain members can input messages to send to the Server
  //validate if feilds are empty 
  if ((handle == "Domingo Selgado") && (text != "") ){
      outbox.send(JSON.stringify({ handle: handle, text: text }));
      $("#input-text")[0].value = "";
  }else if((handle == "") || (text=="")) {
      alert("EROR: missing feilds: Please inter information in both feilds")
  }else{
      alert('ERROR: Invalid user detected, your are not authorized to send messages')
  }

});

//Testing
//Test 1 - handle = "Domingo Selgado"  text = "my message", test was a success, data return in chat area
//Test 2 - handle = ""  and text = "", test a succes, error message diplayed
//Test 3 = handle = "Domingo Selgado" and text = "", test was a succes, Error message displayed