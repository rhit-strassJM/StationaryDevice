document.addEventListener('DOMContentLoaded', function() {
    // Firebase configuration
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

    
       
     
    function playSound(soundURL) {
        var audio = new Audio(soundURL);
        audio.play().then(function() {
            console.log('Audio playback started successfully');
        }).catch(function(error) {
            console.error('Error playing audio:', error);
        });
    }
    
    function checkAndPlayAlarms() {
        firebase.database().ref('alarms').once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var alarmData = childSnapshot.val();
                var currentDateTime = new Date();
    
                currentDateTime.setSeconds(0);
                currentDateTime.setMilliseconds(0);
    
                var alarmDateTime = new Date(alarmData.alarmDateTime);
    
                alarmDateTime.setSeconds(0);
                alarmDateTime.setMilliseconds(0);
    
                console.log(alarmDateTime.getTime() + " vs. " + currentDateTime.getTime());
                var tolerance = 1000; // 1 second tolerance

                if (Math.abs(alarmDateTime.getTime() - currentDateTime.getTime()) <= tolerance) {
                    console.log("time matched!")
                    playSound(alarmData.audioURL);
                    // Remove the entry from the database
                    childSnapshot.ref.remove()
                        .then(function() {
                            console.log("Alarm entry removed from the database");
                        })
                        .catch(function(error) {
                            console.error("Error removing alarm entry:", error);
                        });
                }
            });
        }).catch(function(error) {
            console.error('Error retrieving alarms:', error);
        });
    }
        
    console.log("Initializing...");
    
    setInterval(checkAndPlayAlarms, 1000);
    

    // Function to fetch images from Firebase Storage
    function fetchImages() {
        var imagesRef = storage.ref().child('images'); // Reference to the 'images' directory in storage

        imagesRef.listAll().then(function(result) {
            // Get the reference to the carousel inner container
            var carouselInner = document.querySelector('.carousel-inner');

            // Iterate through each item in the directory
            result.items.forEach(function(imageRef, index) {
                // Get the download URL for each image
                imageRef.getDownloadURL().then(function(url) {
                    // Create image element and set its source to the URL
                    var img = document.createElement('img');
                    img.src = url;
                    img.style.width = '450px'; // Set width to desired size
                    img.style.height = '350px'; // Set height to desired size

                    // Create carousel item and append the image to it
                    var carouselItem = document.createElement('div');
                    carouselItem.className = 'carousel-item';

                    // Append image to carousel item
                    carouselItem.appendChild(img);

                    // Append carousel item to carousel inner container
                    carouselInner.appendChild(carouselItem);

                    // Activate first carousel item after all images are loaded
                    if(index === 0) {
                        carouselItem.classList.add('active');
                    }
                }).catch(function(error) {
                    console.error('Error getting download URL:', error);
                });
            });
        }).catch(function(error) {
            console.error('Error listing images:', error);
        });
    }

    // Call fetchImages() function to load images when the page loads
    fetchImages();

    // Auto slide to the next image every 5 seconds
    setInterval(function() {
        var activeItem = document.querySelector('.carousel-item.active');
        var nextItem = activeItem.nextElementSibling || document.querySelector('.carousel-inner').firstElementChild;
        activeItem.classList.remove('active');
        nextItem.classList.add('active');
    }, 5000); // Change image every 5 seconds (5000 milliseconds)
});