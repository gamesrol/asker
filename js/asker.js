var points  = {}
var runing = false
var state = 1
var turn = []
var a_timer = new Audio('sounds/timer.mp3');
var a_stop = new Audio('sounds/stop.mp3');
const optionList = ["a","b","c","d"];

a_timer.loop = true;
a_timer.volume = 0.05;
a_stop.volume = 0.05;

function recive(sms_org) {
    if(sms_org.includes("PRIVMSG")){
        sms = parseMessage(sms_org);
        
        console.log(sms);

        if (sms.tags.mod != "0" || sms.source.nick == nick){
            commands(sms)
        }

        if (optionList.some(option => option == sms.parameters.toLowerCase())){
            if(runing){
                // Delete sms ASAP we receive it, to hide the response from other user.
                delete_sms(sms.tags.id)
                if(!turn.includes(sms.source.nick)){
                    let val = 0
                    if(questions[state].correct.toLowerCase() == sms.parameters.toLowerCase()){
                        val = 1
                    }

                    if (points[sms.source.nick] == null){
                        points[sms.source.nick] = val
                    }else{
                        points[sms.source.nick] += val
                    }

                    send(replyToUser(sms.source.nick, "tu voto ha sido anotado."))
                    turn.push(sms.source.nick)
                }else{
                    send(replyToUser(sms.source.nick, "ya has votado esta ronda."))
                }
            }else{
                send(replyToUser(sms.source.nick, "espera a que comience la siguiente ronda."))
            }
        }
    }else{
        console.log("User list recived");
    }        
}

function paint_score() {
    let text = ``
    let order = Object.entries(points).sort(([ak, av], [bk, bv]) => {
        return bv - av;
    })
    
    order.forEach(([key, value]) => {
        text += `<div class="row score"><div class="col-10">${key}</div><div class="col-2">${value}</div></div>`;
    });

    $("#score_text").html(text)
}

function start() {
    points  = {}
    state = 1
    turn = []
    runing = true
    paint_ask()

    $(".movil").addClass("hide")

    setTimeout(() => {
        $("#block").removeClass("hide")

        $("#runing").show()
        $("#stoping").hide()
        $(".response_container").css({color: "black"})

        send("Acaba de comenzar el trivial")
        send("Comenzamos la " + state + "º ronda")
    }, 1000)
}

function stop() {
    runing = false
    turn = []
    
    $("#score").addClass("hide")

    setTimeout(() => {
        paint_score()
        $(".movil").removeClass("hide")
    
        $("#runing").hide()
        if (state < Object.entries(questions).length){
            $("#stoping").show()
        }else{
            $("#finish").show()
        }
    
        send("Finalizamos la " + state + "º ronda")
        $(".response_container").css({color: "grey"})
        $("#response_container_" + questions[state].correct).css({color: "green"})
        $("#score").removeClass("hide")
    }, 1000);
}

function next() {
    runing = true
    state++
    $("#block").addClass("hide")

    setTimeout(() => {
        $(".response_container").css({color: "black"})
        paint_ask()
        $("#stoping").hide()
        $("#runing").show()
        $("#block").removeClass("hide")
    }, 1000);
    send("Comenzamos la " + state + "º ronda")
}

function paint_ask() {
    $("#ask_text").text(state + " - " + questions[state].text)

    $("#response_a").text(questions[state].responses.a)
    $("#response_b").text(questions[state].responses.b)
    $("#response_c").text(questions[state].responses.c)
    $("#response_d").text(questions[state].responses.d)
}

function commands(sms){
    switch (sms.parameters) {
        case "!start":
            start()
            a_timer.play();
            break;

        case "!stop":
            if (runing){
                stop()
                a_timer.pause();
                a_stop.play();
            }else{
                
                send(replyToUser(sms.source.nick,"no hay ninguna ronda activa en este momento."))
            }
            break;

        case "!next":
            if (!runing){
                next()
                a_timer.play();
            }else{
                send(replyToUser(sms.source.nick, "la ronda ya ha comenzado."))
            }
            break;
    
            case "!close":
                $(".movil").addClass("hide")
                break;

        default:
            break;
    }
}

function replyToUser(user, msg) {
    return "@" + user + " " + msg;
}
