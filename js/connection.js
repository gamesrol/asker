$(document).ready(function () {
  get_user()
    .then((data_user) => {
      user = data_user;
    })
    .catch((error) => {
      console.log(error);
    })
});

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: nick,
    password: "oauth:" + token
  },
  channels: [channel]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  recive(message, tags)
});

function delete_sms(sms) {
  $.ajax({
    url: "https://api.twitch.tv/helix/moderation/chat?broadcaster_id=" + user.id + "&moderator_id=" + user.id + "&message_id=" + sms,
    type: 'DELETE',
    headers: {
      "Authorization": "Bearer " + token,
      "Client-Id": client_id
    }
  });
}

function get_user() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'https://api.twitch.tv/helix/users?login=' + nick,
      type: 'GET',
      headers: {
        "Authorization": "Bearer " + token,
        "Client-Id": client_id
      },
      success: function (data) {
        resolve(data.data[0]);
      },
      error: function (error) {
        reject(error);
      }
    });
  })
}