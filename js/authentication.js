// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = {
    apiKey: "AIzaSyDyTrrSfHCOqCQ_nEreJHzEDZRar1YrV2o",
    authDomain: "fitcheck-91d37.firebaseapp.com",
    databaseURL: "https://fitcheck-91d37-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fitcheck-91d37",
    storageBucket: "fitcheck-91d37.appspot.com",
    messagingSenderId: "962396261979",
    appId: "1:962396261979:web:20161107427c928bf6b97e",
    measurementId: "G-NP0PPTH0RB"
    };

let app = firebase.initializeApp(firebaseConfig)
let db = app.firestore()
let auth = app.auth()

//user database
let userDatabase = db.collection('users')

// field validation
var emailV = false;
var nameV = false;
var passwordV = false;


//user registration
const register = () => {
    const email = document.getElementById("regEmail").value
    if (email == "" || !email.includes("@")){
        document.getElementById("emailError").innerText = "Please enter a valid email address."
    } else {
        document.getElementById("emailError").innerText = ""
        emailV = true
    }

    const name = document.getElementById("regName").value
    if (name == ""){
        document.getElementById("nameError").innerText = "Please enter a valid name."
    } else {
        document.getElementById("nameError").innerText = ""
        nameV = true
    }

    const password = document.getElementById("regPassword").value
    const confirmPassword = document.getElementById("confirmPassword").value
    if (password == ""){
        document.getElementById("passwordError").innerText = "Please enter a valid password with minimum 6 characters."
    } else if (!validatePW(password)){
        document.getElementById("passwordError").innerText = "Password has to be minimum 6 characters and contain at least 1 uppercase alphabetical character, 1 lower alphabetical character, 1 numeric number and one special character."
    } else if (password != confirmPassword){
        document.getElementById("passwordError").innerText = ""
        document.getElementById("confirmError").innerText = "Passwords do not match."
    } else {
        document.getElementById("confirmError").innerText = ""
        passwordV = true
    }

    if (nameV && emailV && passwordV) {
        auth.createUserWithEmailAndPassword(email, password)
        .then((res) => {
            var userId = res.user.uid
            console.log(userId)

            //user data
            var userData = {
                email: email,
            }

            //push to FB
            userDatabase.doc(userId).set(userData)
            .then(() => {
                console.log("Document written with ID: ", userId);
                openPopup("popupSuccess")
                //add name field to document
                firebase.auth().currentUser.updateProfile({
                displayName: name
                })                
            })
            .catch((err) => {
                console.error("Error adding document: ", err);
            })

        })
        .catch((err) => {
            console.log(err.code)
            if (err.code == "auth/email-already-in-use"){
                document.getElementById("errorMessage").innerText = "Email already has an existing account."
            } else if (err.code == "auth/weak-password"){
                document.getElementById("errorMessage").innerText = "Password is weak. Minimum 6 characters needed."
            } else if (err.code == "auth/invalid-email"){
                document.getElementById("errorMessage").innerText = "Email invalid."
            }else {
                document.getElementById("errorMessage").innerText = "Registration Failed, please try again."
            }
            openPopup("popupError")
        })
    }
}

//user login
const login = () => {
    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value
    auth.signInWithEmailAndPassword(email, password)
    .then((res) => {
        console.log(res.user.id, "successfully logged in")
        window.location.href = "dashboard.html"
    })
    .catch((err) => {
        console.log(err)
        if (err.code == 'auth/user-not-found'){
            document.getElementById("loginError").innerText = "User not found."
        } else {
            document.getElementById("loginError").innerText = "Email or Password is incorrect"
        }
    })
}

//pw validation
function validatePW(password){
    var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
    console.log(regex.test(password))
    return(regex.test(password))
}
