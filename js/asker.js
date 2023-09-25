var points = {};
var runing = false;
var state = 1;
var turn = [];
var a_timer = new Audio('sounds/timer.mp3');
var a_stop = new Audio('sounds/stop.mp3');
const optionList = ["a", "b", "c", "d"];

a_timer.loop = true;
a_timer.volume = 0.05;
a_stop.volume = 0.05;

function recive(message, tags) {
  if (tags.username == nick) {
    commands(message, tags);
  }

  if (optionList.some(option => option == message.toLowerCase())) {
    console.log(message)
    console.log(tags)
    if (runing) {
      // Delete sms ASAP we receive it, to hide the response from other user.
      delete_sms(tags.id);

      if (!turn.includes(tags.username)) {
        turn.push(tags.username);
        if (points[tags.username] == null) {
          points[tags.username] = 0;
        }

        if (state == 1) {
          paint_score(true);
        } else {
          $("#user_" + tags.username).removeClass("unactive")
          $("#user_" + tags.username).addClass("active")
        }

        let val = 0;
        if (questions[state].correct.toLowerCase() == message.toLowerCase()) {
          if (state != Object.keys(questions).length) {
            val = 1;
          } else {
            val = final_point;
          }
        }
        points[tags.username] += val;

        $(`#user_${tags.username}`).css("color", "green");
        client.say(channel, `@${tags.username}, tu voto ha sido anotado!!`);
      } else {
        client.say(channel, `@${tags.username}, ya has votado esta ronda.`);
      }
    } else {
      client.say(channel, `@${tags.username}, espera a que comience la siguiente ronda.`);
    }
  }
}

function paint_score(first = false) {
  let text = ``
  let order = Object.entries(points).sort(([ak, av], [bk, bv]) => {
    return bv - av;
  })

  order.forEach(([key, value]) => {
    let class_ = "unactive";
    let points = value;
    if (turn.includes(key)) {
      class_ = "active"
    }

    if (first) {
      points = 0;
    }

    text += `<div class="row score ${class_}" id="user_${key}"><div class="col-10">${key}</div><div class="col-2">${points}</div></div>`;
  });
  $("#score_text").html(text);
}

function start() {
  points = {};
  state = 1;
  turn = [];
  runing = true;
  paint_ask();

  $(".movil").addClass("hide");

  setTimeout(() => {
    $(".movil").removeClass("hide");

    $("#runing").show();
    $("#stoping").hide();
  }, 1000)
}

function stop() {
  runing = false;
  turn = [];

  $("#score").addClass("hide");

  setTimeout(() => {
    paint_score();

    $("#runing").hide();
    if (state < Object.entries(questions).length) {
      $("#stoping").show();
    } else {
      $("#finish").show();
    }

    client.say(channel, `Finalizamos la ${state}º ronda`);
    $(".response_container").addClass("unactive");
    $("#response_container_" + questions[state].correct).removeClass("unactive");
    $("#response_container_" + questions[state].correct).addClass("active");
    $("#score").removeClass("hide");
  }, 1000);
}

function next() {
  console.log(state)
  console.log(Object.keys(questions).length)
  if (state < Object.keys(questions).length) {
    runing = true;
    state++;
    $("#block").addClass("hide");

    setTimeout(() => {
      $(".response_container").removeClass("unactive");
      $(".response_container").removeClass("active");
      paint_ask();
      $("#stoping").hide();
      $("#runing").show();
      $("#block").removeClass("hide");
    }, 1000);
  } else {
    client.say(channel, `@${nick}, no hay mas preguntas.`);
  }
}

function paint_ask() {
  $("#ask_text").text(state + " - " + questions[state].text);
  $("#response_a").text(questions[state].responses.a);
  $("#response_b").text(questions[state].responses.b);
  $("#response_c").text(questions[state].responses.c);
  $("#response_d").text(questions[state].responses.d);
  client.say(channel, `Comenzamos la ${state}º ronda`);
}

function commands(message, tags) {
  switch (message) {
    case "!start":
      start()
      a_timer.play();
      break;

    case "!stop":
      if (runing) {
        stop()
        a_timer.pause();
        a_stop.play();
      } else {
        client.say(channel, `@${tags.username}, no hay ninguna ronda activa en este momento.`);
      }
      break;

    case "!next":
      if (!runing) {
        next()
        a_timer.play();
      } else {
        client.say(channel, `@${tags.username}, la ronda ya ha comenzado.`);
      }
      break;

    case "!close":
      $(".movil").addClass("hide");
      break;

    default:
      break;
  }
}

function replyToUser(user, msg) {
  return "@" + user + " " + msg;
}
