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

//get document id
var vars = {}; 
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) { 
   vars[key] = value; 
});

function loadInfo(){
    auth.onAuthStateChanged(user => {
        if(user){
            //get from to FB
            var docRef = db.collection('users').doc(user.uid).collection('outfits').doc(vars.id);
            docRef.get()
            .then((doc) => {
                var outfitData = doc.data().outfitData
                // console.log(doc.data())
                document.getElementById('outfitName').innerText = outfitData.name
                document.getElementById('outfitStyle').innerText = outfitData.style.toUpperCase()
                document.getElementById('outfitImg').src = outfitData.url
                document.getElementById('outfitDescription').innerText = outfitData.description
            })
            .catch((error) => {
                console.error("error adding outfit data", error);
            })
        }
    })

}

function deleteOutfit(){
    auth.onAuthStateChanged(user => {
        if(user){
            //delete img from storage            
            var docRef = db.collection('users').doc(user.uid).collection('outfits').doc(vars.id);
            docRef.get()
            .then(() => {
                var storageRef = firebase.storage().ref().child(vars.id)
                storageRef.delete().then(() => {
                    console.log("deleted image from storage")
                }).catch((error) =>{
                    openPopup('error')
                })
            })            
            // delete from FB
            docRef.delete()
            .then(() => {
                window.location.href = "dashboard.html"
            })
            .catch((error) => {
                openPopup('error')
            })
        }
    })
}

function updateOutfit(){
    window.location.href = "updateOutfit.html?id=" + vars.id
}

function openPopup(type) {
    document.getElementById(type + "PopUp").style.display = "block";
    document.getElementById(type + "Overlay").style.display = "block";
}
function closePopup(type) {
    document.getElementById(type + "PopUp").style.display = "none";
    document.getElementById(type + "Overlay").style.display = "none";
}  