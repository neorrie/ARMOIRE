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

//set up cloud storage
var storage = firebase.storage();
var storageRef = storage.ref();

//get document id
var vars = {}; 
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) { 
   vars[key] = value; 
});
console.log("hello")
console.log(vars.id)


// show prefilled fields
auth.onAuthStateChanged((user) => {
	if(user) {
        var docRef = db.collection('users').doc(user.uid).collection('outfits').doc(vars.id);
        docRef.get()
        .then((doc) => {
            var outfitData = doc.data().outfitData
            console.log(outfitData)
                // console.log(doc.data())
                document.getElementById('outfitName').defaultValue = outfitData.name
                document.getElementById('outfitStyle').value = outfitData.style
                document.getElementById('outfitDescription').defaultValue = outfitData.description
                document.getElementById('imageResult').src = outfitData.url
            })
            .catch((error) => {
                console.error("error adding outfit data", error);
            })
    }
})

function updateOutfitData(){
    console.log("helllo")
    var user = firebase.auth().currentUser;
    console.log(user)
    var name = document.getElementById('outfitName').value
    var style = document.getElementById('outfitStyle').value
    var description = document.getElementById('outfitDescription').value
    var displayPhoto = document.getElementById('imageResult').src

    if (name == ""){
        document.getElementById("nameHelp").innerText = "Please enter a name."
        document.getElementById("nameHelp").style.color = "red"
        document.getElementById("nameHelp").style.fontStyle = "italic"
    } else {
        document.getElementById("nameHelp").innerText = ""
    }
    if (description == ""){
        description = "nil"
    }
    if (style == "Choose..."){
        document.getElementById("styleHelp").innerText = "Please select a style."
        document.getElementById("styleHelp").style.color = "red"
        document.getElementById("styleHelp").style.fontStyle = "italic"
    } else {
        console.log(style)
        document.getElementById("styleHelp").innerText = ""
    }

    if (displayPhoto == ""){
        document.getElementById("errorImage").innerText = "Upload a valid image."       
    } else {
        document.getElementById("errorImage").innerText = ""
    }

    if (displayPhoto != "" && name != "" && style != "Choose..."){
        if (document.getElementById("photo").files.length == 0 ){
            console.log("same image ")
            db.collection('users').doc(user.uid).collection('outfits').doc(vars.id)
            .update({
                "outfitData.name": name,
                "outfitData.style": style,
                "outfitData.description": description
            })
            .then(() => {
                openPopup()
            })
        } else {
            console.log("diff image")
            //add image to storage
            var outfitImg = document.querySelector("#photo").files[0];
            console.log(outfitImg)
            cleanedName = outfitImg.name.replaceAll(' ', '')
            var date = new Date();
            const imgName = date.getTime() + cleanedName;
            console.log("IMG NAME:" + imgName);
            const task = storageRef.child(imgName).put(outfitImg);
            task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                db.collection('users').doc(user.uid).collection('outfits').doc(vars.id)
                .update({
                    "outfitData.name": name,
                    "outfitData.style": style,
                    "outfitData.description": description,
                    "outfitData.url": url
                })
                openPopup()
            })            
        }
    }
}
/*  ==========================================
    SHOW UPLOADED IMAGE
* ========================================== */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById("imageResult").src = e.target.result
        };
        reader.readAsDataURL(input.files[0]);
    }
}
/*  ==========================================
    SHOW UPLOADED IMAGE NAME
* ========================================== */
var input = document.getElementById( 'photo' );
var infoArea = document.getElementById( 'photo-label' );

console.log(infoArea)

input.addEventListener( 'change', showFileName );
function showFileName( event ) {
  var input = event.srcElement;
  var fileName = input.files[0].name;
  infoArea.textContent = 'File name: ' + fileName;
  console.log(infoArea.textContent)
}

function showUpdatedOutfit(){
    window.location.href = "showOutfit.html?id=" + vars.id
}

// Pop Up of Outfit added Successfully
function openPopup() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";

}