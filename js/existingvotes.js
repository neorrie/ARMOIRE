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

auth.onAuthStateChanged(user => {
  if(user){
    docRef = db.collection('users').doc(user.uid).collection('votes')
      //for loop through all votes in the "votes" collection
      docRef.get().then(snap => {
        snap.forEach((doc) => {
        if (doc.data().VoteStatus == "Open"){
          // document.getElementById("votelist").innerHTML += `<li><a href=votepageowner.html?voteid=${doc.id}&userid=${user.uid}> ${doc.data().VoteTitle} </a></li>`;
          document.getElementById("votelistOpen").innerHTML += `
          <a href=votepageowner.html?voteid=${doc.id}&userid=${user.uid} class='list-group-item list-group-item-action'>
          <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">Poll Title: ${doc.data().VoteTitle}</h5>
          <small>${doc.data().datecreated}</small>
          </div>
          <p class="mb-1">${doc.data().VoteOccasion}</p></a>`;
        }
        });
      });      
  }

  else {
    console.log("this shit is not working")
  }
})

auth.onAuthStateChanged(user => {

  if(user){
    //push to FB
    console.log("im here")
    docRef = db.collection('users').doc(user.uid).collection('votes')
      //for loop through all votes in the "votes" collection
      docRef.get().then(snap => {
        snap.forEach((doc) => {
        if (doc.data().VoteStatus == "Closed"){
          document.getElementById("votelistClosed").innerHTML += `<a href=votepageownerclosed.html?voteid=${doc.id}&userid=${user.uid} class='list-group-item list-group-item-action'>
          <div class="d-flex w-100 justify-content-between"><h5 class="mb-1">Poll Title: ${doc.data().VoteTitle}</h5><small>${doc.data().datecreated}</small></div><p class="mb-1">${doc.data().VoteOccasion}</p></a>`;
        }
        });
      });      
  }

  else {
    console.log("this shit is not working")
  }
})

// retrieve created vote - need to make it dynamic

// For the tab contents
function openPage(pageName, elmnt, color) {
  // Hide all elements with class="tabcontent" by default */
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the background color of all tablinks/buttons
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = "block";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = color;
}

  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();