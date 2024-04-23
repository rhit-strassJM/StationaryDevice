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
 
     // Get a reference to the Firebase Realtime Database
     var database = firebase.database();
 
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
                     img.style.width = '300px'; // Set width to desired size
                     img.style.height = '200px'; // Set height to desired size
 
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
 
     // Function to play sound from Firebase Storage
     function playSound(soundURL) {
         var audio = new Audio(soundURL);
         audio.play();
     }
 
     // Listen for changes in the Firebase Realtime Database
     database.ref('scheduled_sounds').on('value', function(snapshot) {
         snapshot.forEach(function(childSnapshot) {
             var soundData = childSnapshot.val();
             var currentTime = new Date().toISOString();
 
             // Compare current time with the time stored in the database
             if (soundData.time === currentTime) {
                 // Play the associated sound
                 playSound(soundData.soundURL);
 
                 // Remove the entry from the database
                 childSnapshot.ref.remove();
             }
         });
     });
 
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