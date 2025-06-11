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

/*  ==========================================
    SHOW UPLOADED IMAGE
* ========================================== */
//preview image
const reader = new FileReader;
let imgPreview = document.querySelector('#profilePreview');
const fileInput = document.querySelector('#updatePhoto');
reader.onload = e => {
    imgPreview.src = e.target.result;
}
fileInput.addEventListener('change', e => {
    const f = e.target.files[0];
    console.log(f);
    reader.readAsDataURL(f);
})
/*  ==========================================
    SHOW UPLOADED IMAGE NAME
* ========================================== */
var input = document.getElementById( 'updatePhoto' );
var infoArea = document.getElementById( 'photo-label' );

console.log(infoArea)

input.addEventListener( 'change', showFileName );
function showFileName( event ) {
  var input = event.srcElement;
  var fileName = input.files[0].name;
  infoArea.textContent = 'File name: ' + fileName;
  console.log(infoArea.textContent)
}

function updatePicture(){
    user = firebase.auth().currentUser;
    var profilePicture = document.querySelector("#updatePhoto").files[0];
    console.log(document.querySelector("#updatePhoto").files.length)
    console.log(profilePicture)
    if (document.querySelector("#updatePhoto").files.length > 0){
        const imgName = user.uid + "_profilePicture";
        const task = storageRef.child("profile").child(imgName).put(profilePicture);
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            imgURL = url;
            //retrieve user id
            auth.onAuthStateChanged(user => {
            //   console.log("authentication")
            if(user){
                user.updateProfile({photoURL: imgURL})
                .then(()=> {
                    openPopup("successful")
                    document.getElementById("successMsg").innerText = "Successfully updated!"
                })
                .catch((error) => {
                    openPopup("error")
                    document.getElementById("errorMsg").innerText = "Update failed"
                })
            }
        })
        })
    } else{
        openPopup("error")
        document.getElementById("errorMsg").innerText = "Update failed.\nAdd valid image and try again."
    }

}

function updateProfile(){
    user = firebase.auth().currentUser;
    
    //update name and email
    var updateName = document.getElementById("updateName").value
    var email = document.getElementById("updateEmail").value
    if(updateName=="" && email==""){
        document.getElementById("accError").innerText = "Fields are empty."
    } else{
        if (updateName == "") {
        updateName = this.user.displayName
        } 
        if (email == "") {
        email = this.user.email
        } 

        user.updateEmail(email)
        .then(() => {
            user.updateProfile({displayName: updateName})
            db.collection("users").doc(user.uid).update({
            displayName: updateName,
            email: email
            })
            .then(() => {
                openPopup('successful')
                document.getElementById("successMsg").innerText = "Successfully updated account details."
            })       
        })
        .catch(err => {
            openPopup('error');
            console.log(err)
            if (err.code == "auth/invalid-email"){  
                document.getElementById('errorMsg').innerText = "Invalid email entered. Please enter a valid email."
            } else if (err.code == "auth/email-already-in-use"){
                document.getElementById("errorMsg").innerText = "Email already has an existing account."
            } else if (err.code == 'auth/requires-recent-login') {
                document.getElementById("errorMsg").innerText = "Session time out.\nPlease login again to update account details."
            } else {
                document.getElementById("errorMsg").innerText = "Email address update unsuccessful.\nPlease try again."
            }
        })    
    }
};

function updatePassword(){
    user = firebase.auth().currentUser;

    //update password
    var updatePassword = document.getElementById("updatePassword").value
    var confirmPassword = document.getElementById("confirmPassword").value

    if(!validatePW(updatePassword)){
        document.getElementById("passwordError").innerText = "Password has to be minimum 6 characters and contain at least 1 uppercase alphabetical character, 1 lower alphabetical character, 1 numeric number and one special character."
    } else {
        if (updatePassword == confirmPassword){
            user.updatePassword(updatePassword)
            .then(()=>{
                openPopup("successful")
                document.getElementById("successMsg").innerText = "Password successfully updated!"
            })
            .catch((err) =>{
                //if require recent login
                if (err.code == "auth/requires-recent-login"){
                    openPopup('error');
                    document.getElementById("errorMsg").innerText = "Session time out. Please login again to update account password"
                } else{
                    error = err.message
                    document.getElementById("passwordError").innerText = err.message
                }
            })   
        } else {
            document.getElementById("passwordError").innerText = "Passwords do not match. Please re-enter password."
        }
    }
};

function deleteProfile(){
    const user = firebase.auth().currentUser;
    // console.log(user.uid)
    db.collection("users").doc(user.uid).delete()
    .then(() => {
        window.location.href = "index.html"
    })
    .catch((err) => {
        if (err.code == "auth/requires-recent-login"){
            openPopup('error');
            document.getElementById("errorMsg").innerText = "Session time out. Please login again to delete account."
            alert("Error deleting profile")
        }
    })
}
function openPopup(type) {
    document.getElementById(type+"PopUp").style.display = "block";
    document.getElementById(type+"Overlay").style.display = "block";
}

//pw validation
function validatePW(password){
    var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
    return(regex.test(password))
}