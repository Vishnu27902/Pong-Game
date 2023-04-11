import Ball from "./ball.js";
import Paddle from "./paddle.js";

const ball = new Ball(document.getElementById("ball"));
const player_paddle = new Paddle(document.getElementById("player_paddle"));
const computer_paddle = new Paddle(document.getElementById("computer_paddle"));

const player_score = document.getElementById("player_score");
const computer_score = document.getElementById("computer_score");
let requestId;
let flag=false;

let audio=["./button.mp3","./exit.wav","./crash.mp3"];
audio=audio.map(sound=>new Audio(sound));

let lastTime;

function update(time) {
    if (lastTime != null) {
        const modTime = time - lastTime;
        ball.update(modTime, [player_paddle.rect(), computer_paddle.rect()]);
        computer_paddle.update(modTime, ball.y);
        const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"));
        document.documentElement.style.setProperty("--hue", hue + 0.01);
        if (isLose()) {
            handleLose();
        }
    }
    lastTime = time;
    requestId=window.requestAnimationFrame(update);
}

document.addEventListener("mousemove", (event) => {
    if(flag){
        player_paddle.position = (event.y / window.innerHeight) * 100;
    }
})

function isLose() {
    const rect = ball.rect();
    return rect.right >= window.innerWidth || rect.left <= 0;
}

function handleLose() {
    getAudio(2);

    const rect = ball.rect();
    if (rect.right >= window.innerWidth) {
        player_score.textContent = parseInt(player_score.textContent) + 1;
    } else {
        computer_score.textContent = parseInt(computer_score.textContent) + 1;
    }
    ball.reset();
    computer_paddle.reset();
}

$(document).ready(function () {

    $("#dialog").dialog({
        width: 350,
        height: 120,
        modal: true,
        resizable: true,
        dialogClass: "no-close dialog"
    });

    $("form").submit(function (event) {
        getAudio(0);

        let formData = { 
            name: $("#name").val() 
        };
        // console.log($("#name").val())

        $.ajax({
            type: "POST",
            url: "./onStart.php",
            data: formData,
            dataType: "json",
            encode: true
        }).done(data => {
            // let modData= JSON.parse(data);
            console.log(data);
            if (data.status) {
                flag=true;
                $("#high_score").text(`${data.playername}(${data.highscore}/${data.computerscore})`);
                window.requestAnimationFrame(update);
            }
        });

        $(this).closest(".ui-dialog-content").dialog("close");
        event.preventDefault();
    })
})

window.addEventListener("keydown", exit);

function exit(event) {
    if (event.key == "x") {
        event.preventDefault();
        getAudio(1);

        let formData={
            playername:$("#name").val(),
            highscore:Number.parseInt($("#player_score").text()),
            computerscore:Number.parseInt($("#computer_score").text())
        };

        $.ajax({
            type:"POST",
            url:"./onEnd.php",
            data:formData,
            dataType:"json",
            encode: true
        }).done(function(data){
            console.log(data);
        });

        reset();
        flag=false;
        $("#dialog").dialog("open");
        $("#name").val("");
    }

}

function reset(){
    $("#player_score").text(0);
    $("#computer_score").text(0);
    $("#high_score").text("None");

    ball.reset();
    player_paddle.reset();
    computer_paddle.reset();

    window.cancelAnimationFrame(requestId);
}

function getAudio(index){
    audio[index].play();
}

// function validate(inputData){
//     expression=/^[0-9a-zA-Z\s]+$/;
//     if(!expression.test(inputData)){
//         const promise=new Promise((res)=>{
//             if(true){
//                 $("#warning").css("display","block");
//                 setTimeout(()=>{
//                     $("#warning").css("display","none");
//                     res();
//                 },3000);
//             }
//         })
//         promise();
//     }
//     else{
//         console.log();
//     }
// }
