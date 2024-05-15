document.addEventListener('DOMContentLoaded', function() {// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDzY5iuxQuSOBH33ek5RsF0AEIS_vl2CJ4",
      authDomain: "forget-me-not-74a74.firebaseapp.com",
      databaseURL: "https://forget-me-not-74a74-default-rtdb.firebaseio.com/",
      projectId: "forget-me-not-74a74",
      storageBucket: "forget-me-not-74a74.appspot.com",
      messagingSenderId: "214952191183",
      appId: "1:214952191183:web:84d5d9a3b75bea6f1043ba",
      measurementId: "G-LNF4FK3XM1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();

var database = firebase.database();


// get the time elements
let hrs = document.getElementById('hrs');
let mins = document.getElementById('mins');
let secs = document.getElementById('secs');
let timeType = document.getElementById('time');
let dayDate = document.getElementById('date');

let date = new Date().toDateString();
dayDate.textContent = date;

// function to calculate time and date
function calculateTime() {
    let time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let type = "";

    if (hours < 12) {
        type = "AM";
    } else {
        type = "PM"
    }

    if (hours == 0) {
        hours = 12;
    }

    if (hours > 12) {
        hours = hours - 12;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    hrs.textContent = hours;
    mins.textContent = minutes;
    secs.textContent = seconds;
    timeType.textContent = type;

    checkAndPlayAlarms(); // Call checkAndPlayAlarms() here
}

setInterval(calculateTime, 1000);

function playSound(soundURL) {
    var audio = new Audio(soundURL);
    audio.play().then(function () {
        console.log('Audio playback started successfully');
    }).catch(function (error) {
        console.error('Error playing audio:', error);
    });
}

function checkAndPlayAlarms() {
    firebase.database().ref('alarms').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var alarmData = childSnapshot.val();
            var currentDateTime = new Date();

            currentDateTime.setSeconds(0);
            currentDateTime.setMilliseconds(0);

            var alarmDateTime = new Date(alarmData.alarmDateTime);

            alarmDateTime.setSeconds(0);
            alarmDateTime.setMilliseconds(0);

            console.log(alarmDateTime.toISOString() + " vs. " + currentDateTime.toISOString());
            console.log((alarmDateTime.toISOString() == currentDateTime.toISOString()))


            if (alarmDateTime.toISOString() == currentDateTime.toISOString()) {
                console.log("time matched!")
                playSound(alarmData.audioURL);
                // Remove the entry from the database
                childSnapshot.ref.remove()
                    .then(function () {
                        console.log("Alarm entry removed from the database");
                    })
                    .catch(function (error) {
                        console.error("Error removing alarm entry:", error);
                    });
            }
        });
    }).catch(function (error) {
        console.error('Error retrieving alarms:', error);
    });
}

console.log("Initializing...");
});