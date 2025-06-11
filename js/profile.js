//user authentication
var firebaseConfig = {
	apiKey: "AIzaSyDyTrrSfHCOqCQ_nEreJHzEDZRar1YrV2o",
	authDomain: "fitcheck-91d37.firebaseapp.com",
	databaseURL: "https://fitcheck-91d37-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "fitcheck-91d37",
	storageBucket: "fitcheck-91d37.appspot.com",
	messagingSenderId: "962396261979",
	appId: "1:962396261979:web:20161107427c928bf6b97e",
	measurementId: "G-NP0PPTH0RB"
	};

var app = firebase.initializeApp(firebaseConfig)
var db = app.firestore()
var auth = app.auth()
//set up cloud storage
var storage = firebase.storage();
var storageRef = storage.ref(); 

auth.onAuthStateChanged((user) => {
	if(user) {
		const userId = user.uid;
		console.log(userId)
        // The user object has basic properties such as display name, email, etc.
        const displayName = user.displayName;
        const email = user.email;
        document.getElementById("profileName").innerText = displayName;
        document.getElementById("profileEmail").innerText = email
        //retrieve profile image
        const profilePhoto = user.uid + "_profilePicture";
        storageRef.child("profile/" + profilePhoto)
          .getDownloadURL()
          .then(url => {
          console.log("test",url)
          document.getElementById("profilePhoto").src = url;
          })
          .catch(err => {
            storageRef.child("profile/blank_avatar.jpeg")
            .getDownloadURL()
            .then(url => {
            console.log("test",url)
            document.getElementById("profilePhoto").src = url;
            })
          })
        
        
	} else {
		window.location.href = "login.html"		
		console.log("User not authenticated, sign in again.")
	}
	console.log("user: ", user)
})
