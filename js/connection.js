var socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
var user;

$( document ).ready(function() {    
    get_user()
        .then((data_user) => {
            user = data_user;
            run(); 
        })
        .catch((error) => {
            console.log(error);
        })
});

function run() {
    socket.onopen = function(e) {
        console.log("[open] Connection established");
        console.log("Sending to server");

        socket.send('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
        socket.send('PASS oauth:' + token);
        socket.send('NICK ' + nick);
        socket.send('JOIN ' + channel);
        socket.send('PING :tmi.twitch.tv');
    };

    socket.onmessage = function(event) {
        recive(event.data)
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.log('[close] Connection died');
        }
    };

    socket.onerror = function(error) {
        console.log(`[error] ${error.message}`);
    };
}
    
function send(sms){
    socket.send("PRIVMSG " + channel + " :" + sms);
}

function delete_sms(sms){
    $.ajax({
        url: "https://api.twitch.tv/helix/moderation/chat?broadcaster_id=" + user.id + "&moderator_id=" + user.id + "&message_id=" + sms,
        type: 'DELETE',
        headers: {
            "Authorization": "Bearer " + token,
            "Client-Id": client_id
        }
    });
}

