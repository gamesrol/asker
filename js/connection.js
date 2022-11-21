var socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

$( document ).ready(function() {
    socket.onopen = function(e) {
        console.log("[open] Connection established");
        console.log("Sending to server");

        socket.send('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
        socket.send('PASS ' + pass);
        socket.send('NICK ' + nick);
        socket.send('JOIN ' + channel);
        socket.send('PING :tmi.twitch.tv');
    };

    socket.onmessage = function(event) {
        recive(event.data)
    };

    socket.onclose = function(event) {
        console.log(event);
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.log('[close] Connection died');
        }
    };

    socket.onerror = function(error) {
        console.log(`[error] ${error.message}`);
    };
});

function send(sms){
    socket.send("PRIVMSG " + channel + " :" + sms)
}

function delete_sms(sms){
    socket.send("PRIVMSG  " + channel + " :/delete " + sms)
}

