﻿var count;
var timerElement;
var timerIntervalObj;
var cdTimerIntervalObj;
var seconds;
var minutes;
var currentTime;

// CountDown Timer
var cdSeconds;
var cdMinutes;
var cdTimerElement;
var cdCurrentTime;
var countDown;

var siteBaseUrl = "";

var fitnessRatingData;
var allPlayersData;

var progressBarObj = { start: 0, end: 0, current: 0 }

// Shuttel Vars

var currentShuttleLevelNumber;
var currentShuttleNumber;
var currentShuttleSpeed;
var currentTotalDistance;



// Init code..
$(function () {
    init();
});

function init() {
    count = 0;
    timerElement = $('#timer');
    cdTimerElement = $('#cdTimer');
    currentShuttleNumber = 0;
    currentTime = "00:00";
    $(".progress").hide();
    //load json data..
    getFitnessRatingData();
    getPlayersData();

    //init UI..
    $("#controls").removeAttr("hidden");
    $("#pauseBtn").hide();
    $("#playBtn").show();

    $("#restartBtn").hide();


}

function fitnessRatingDataLoaded() {
    initProgressBarData();

}


// Events Entry..
function stop() {
    stopTimer();
    $(".progress").hide();
    $("#pauseBtn").hide();
    $("#playBtn").show();
}

function start() {
    $(".progress").show();
    startTimer();
    startCountDownTimer();

    processSuttle();

    $("#pauseBtn").show();
    $("#playBtn").hide();

    $(".btnPlayer").removeAttr("hidden");
    $("#finishTestBtn").removeAttr("hidden");

}

function restart() {
    location.reload();
}

// Timer Logic..
function timer() {
    count++;

    seconds = pad(count % 60);
    minutes = pad(parseInt(count / 60));

    currentTime = minutes + ":" + seconds

    timerElement.text(currentTime);
    processSuttle();

}


function countDownTimer() {
    countDown--;

    cdSeconds = pad(countDown % 60);
    cdMinutes = pad(parseInt(countDown / 60));

    cdCurrentTime = cdMinutes + ":" + cdSeconds



    cdTimerElement.text(cdCurrentTime);

    if (countDown <= 0) {
        clearInterval(cdTimerIntervalObj);
        countDown = 0;
    }

}

// Second Minute Helper
function pad(val) {
    let valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function startTimer() {
    timerIntervalObj = setInterval(timer, 1000);
}

function startCountDownTimer() {
    //countDown = timeSpan;
    cdTimerIntervalObj = setInterval(countDownTimer, 1000);
}

function stopTimer() {
    clearInterval(timerIntervalObj);
    clearInterval(cdTimerIntervalObj);
}

function initShuttleData() {

}


// Shuttle Processing..
function processSuttle() {
    if (fitnessRatingData) {
        $.each(fitnessRatingData, function (index, item) {

            if (item.startTime === currentTime) {
                console.log(item, index);

                currentShuttleLevelNumber = item.speedLevel;
                currentShuttleNumber = item.shuttleNo;
                currentShuttleSpeed = item.speed;
                if (index > 0) currentTotalDistance = item.accumulatedShuttleDistance;

                if (index < fitnessRatingData.length) {
                    if (index !== fitnessRatingData.length - 1) {
                        let countDownSeconds = calculateCountDownTime(fitnessRatingData[index], fitnessRatingData[index + 1]);
                        countDown = countDownSeconds;
                    }

                    //resetting timer
                    if (cdTimerIntervalObj) {
                        clearInterval(cdTimerIntervalObj);
                    }

                    startCountDownTimer();

                    // Progress change..
                    progressBarObj.current = item.accumulatedShuttleDistance;
                    calculateProgressBarData();
                }

                if (index === fitnessRatingData.length - 1) {
                    // finished..
                    finishTest();
                }


                updateProcessedUi();
                //return false;
            }
        });
    }
}

function updateProcessedUi() {
    $("#currentShuttleLevelNumber").text(currentShuttleLevelNumber);
    $("#currentShuttleNumber").text(currentShuttleNumber);
    $("#currentShuttleSpeed").text(currentShuttleSpeed);
    $("#currentTotalDistance").text(currentTotalDistance);
}

function initProgressBarData() {
    // Setting progress bar..
    if (fitnessRatingData) {
        progressBarObj.start = fitnessRatingData[0].accumulatedShuttleDistance;
        progressBarObj.end = fitnessRatingData[fitnessRatingData.length - 1].accumulatedShuttleDistance;
        progressBarObj.current = fitnessRatingData[0].accumulatedShuttleDistance;
    }
    $("#speed-level-progress-bar").css('width', 0 + '%');
}

// Getting FitnessRating Data..

function getFitnessRatingData() {
    $.ajax({
        url: siteBaseUrl + "/api/FitnessRating", success: function (result) {
            fitnessRatingData = result;
            fitnessRatingDataLoaded();
            //console.log(result);
            //processSuttle();
        }
    });
}

function getPlayersData() {
    $.ajax({
        url: siteBaseUrl + "/api/GetPlayers", success: function (result) {
            allPlayersData = result;
        }
    });
}

// Utilities..
function calculateCountDownTime(currentRating, nextRating) {

    let currentTime = currentRating.startTime.split(":");
    let nextTime = nextRating.startTime.split(":");

    let countDownTime = (parseInt(nextTime[0]) * 60 + parseInt(nextTime[1])) - (parseInt(currentTime[0]) * 60 + parseInt(currentTime[1]));
    console.log(currentTime, nextTime, countDownTime);

    return countDownTime;
}

function calculateProgressBarData() {
    let progressPercent = percentage(parseInt(progressBarObj.current), parseInt(progressBarObj.end));
    $("#speed-level-progress-bar").css('width', progressPercent + '%');
}

function percentage(partialValue, totalValue) {
    return parseInt((100 * partialValue) / totalValue);
}


// Player Events..
function warnPlayer(playerIdUiRef, playerId) {
    let btnName = '#warnBtn' + playerIdUiRef;
    let stopBtnName = '#stopBtn' + playerIdUiRef;
    console.log(btnName, playerIdUiRef);

    $(btnName).attr("disabled", true);
    $(btnName).removeClass("btn-outline-warning");
    $(btnName).addClass("btn-outline-dark");

    $(stopBtnName).attr("disabled", false);



    $.ajax({
        url: siteBaseUrl + "/api/WarnPlayer/" + playerId,
        success: function (result) {
            console.log(result);
        }
    });
}

function stopPlayer(playerIdUiRef, playerId) {

    let finishedPlayer = '.finished' + playerIdUiRef;
    let finishedPlayerDd = '#finished' + playerIdUiRef;
    let btnPlayer = '.btn' + playerIdUiRef;

    $(btnPlayer).hide();

    $(finishedPlayer).removeAttr("hidden");
    populateDropDown(finishedPlayerDd, currentShuttleLevelNumber, currentShuttleNumber);

    console.log(playerId);
    let playerResult = currentShuttleLevelNumber + "-" + currentShuttleNumber;

    setPlayerResult(playerId, playerResult);
}

function populateDropDown(playerIdentifier, currentShuttleLevelNumber, currentShuttleNumber) {
    $(function () {
        //Reference the DropDownList.
        let ddPlayerResult = $(playerIdentifier);

        let option1 = $("<option />");
        option1.html("Choose");
        option1.val("");
        ddPlayerResult.append(option1);

        //Loop and add the Year values to DropDownList.
        $.each(fitnessRatingData, function (index, item) {
            let option = $("<option />");
            option.html(item.speedLevel + "-" + item.shuttleNo);
            option.val(item.speedLevel + "-" + item.shuttleNo);
            if (item.speedLevel === currentShuttleLevelNumber && item.shuttleNo === currentShuttleNumber) {
                option.attr("selected", true);
            }
            ddPlayerResult.append(option);
            //console.log(item);
        });

    });
}

function playerResultChanged(playerId, playerElementRefId) {
    let playerRef = "#" + playerElementRefId;
    console.log(playerId, playerElementRefId, $(playerRef).val());
    let playerResult = $(playerRef).val();
    setPlayerResult(playerId, playerResult);

}

function setPlayerResult(playerId, playerResult) {
    $.ajax({
        url: siteBaseUrl + "/api/ResultPlayer/" + playerId,
        type: "POST",
        data: {
            id: playerId,
            result: playerResult
        },
        success: function (result) {
            console.log(result);
        }
    });
}

function finishTest() {
    $.each(allPlayersData, function (index, item) {
        let runningPlayer = ".finishedPlayer-" + item.id;

        if ($(runningPlayer).attr("hidden")) {
            let nonfinishedPlayer = "Player-" + item.id;

            stopPlayer(nonfinishedPlayer, item.id);

            console.log(item.id);

        }

    })


    // finished..
    stop();

    $("#finishTestBtnEle").text("Finished");

    $("#pauseBtn").hide();
    $("#playBtn").hide();

    $("#restartBtn").show();
}