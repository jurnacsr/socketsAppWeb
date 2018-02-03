var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    console.log("connecting...");
    var socket = new SockJS('http://localhost:8080/socket');
    stompClient = Stomp.over(socket);
    stompClient.connect({},
        function (frame) {
            setConnected(true);
            console.log("HEY HEY HEY");
            console.log(frame);
            stompClient.subscribe('/message/12345', function (msg) {
                console.log("GOT MESSAGE");
                console.log(JSON.parse(msg.body));
                showGreeting(JSON.parse(msg.body).payload);
            });
        },
        function (err) {
            console.log(err);
        });
}

function disconnect() {
    console.log("disconnect");
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    console.log("send name");
    stompClient.send("/app/message", {}, JSON.stringify({'payload': $("#name").val()}));
}

function showGreeting(message) {
    console.log("show greeting");
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    console.log("loaded");
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});