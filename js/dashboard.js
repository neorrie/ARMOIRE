//user authentication
var firebaseConfig = {
  apiKey: "AIzaSyDyTrrSfHCOqCQ_nEreJHzEDZRar1YrV2o",
  authDomain: "fitcheck-91d37.firebaseapp.com",
  databaseURL:
    "https://fitcheck-91d37-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fitcheck-91d37",
  storageBucket: "fitcheck-91d37.appspot.com",
  messagingSenderId: "962396261979",
  appId: "1:962396261979:web:20161107427c928bf6b97e",
  measurementId: "G-NP0PPTH0RB",
};

var app = firebase.initializeApp(firebaseConfig);
var db = app.firestore().collection("users");
var auth = app.auth();


function filterSelection(query){
  //clear existing elements
  var e = document.getElementById("dashboard");
  e.innerHTML = "";
  loadImages(query)
  var divs = document.getElementsByClassName("filters")
  len = divs.length
  for (var i = 0; i<len; i++) {
    console.log(divs[i])
    divs[i].setAttribute("class", "col filters tablink")
  } 
  document.getElementById(query).setAttribute("class", "col filters tablink tablink-active")
}
  

//load image function
function loadImages(query){
  firebase.auth().onAuthStateChanged((user) => {
    var container = document.getElementById('dashboard');
    var colDiv1 = document.createElement("div")
    colDiv1.setAttribute("class", "col-lg-3 col-md-6 col-sm-12 mb-4 mb-lg-0");
    var colDiv2 = document.createElement("div")
    colDiv2.setAttribute("class", "col-lg-3 col-md-6 col-sm-12 mb-4 mb-lg-0")
    var colDiv3 = document.createElement("div")
    colDiv3.setAttribute("class", "col-lg-3 col-md-6 col-sm-12 mb-4 mb-lg-0")
    var colDiv4 = document.createElement("div")
    colDiv4.setAttribute("class", "col-lg-3 col-md-6 col-sm-12 mb-4 mb-lg-0")
    var col_count = 1
    var count = 0
    

    if (user) {
      const userId = user.uid;
      console.log("uid=", userId);
      const userDB = db
        .doc(userId)
        .collection("outfits")
        .get()
        .then((querySnapshot) => {
          
          querySnapshot.forEach((doc) => {
            var outfitStyle = doc.data().outfitData.style;
            console.log(doc.id, "=", doc.data());
            console.log("count=", col_count);

            //query == 'all'
            if (query == 'all'){
              count = querySnapshot.size
              imgURL = doc.data().outfitData.url
              
              // images for dashboard
              //create image tag
              var img = document.createElement('img');
              img.src = imgURL
              img.alt = doc.id
              img.setAttribute("class","img-fluid w-100 shadow-1-strong rounded")

              //create inner dig tag
              var iDiv = document.createElement('div');
              iDiv.setAttribute("class","dashboard-links d-flex align-items-center justify-content-center")
              //create link tag
              var link = document.createElement('a');

              link.href = "showOutfit.html?id=" + doc.id

              link.setAttribute("id", doc.id)
              link.setAttribute("class","glightbox preview-link")
              //create i tag
              var i = document.createElement('i');
              i.setAttribute("class","bi bi-arrows-angle-expand")
              //insert i into link 
              link.appendChild(i)
              //insert link into inner div tag
              iDiv.appendChild(link);
              //create outer div box tag
              var oDiv = document.createElement('div')
              oDiv.setAttribute("class", 'container-fluid dashboard-item mb-4')
              oDiv.setAttribute("style", "padding-right: 0px;padding-left: 0px")
              //insert img and inner div box
              oDiv.appendChild(img)
              oDiv.appendChild(iDiv)

              // see count, append accordingly
              if (col_count == 1){
                colDiv1.appendChild(oDiv)
                console.log(colDiv1.innerHTML)
              } else if (col_count == 2){
                colDiv2.appendChild(oDiv)
              } else if (col_count == 3){
                colDiv3.appendChild(oDiv)
              } else if (col_count == 4){
                colDiv4.appendChild(oDiv)
                col_count = 0
              }
              col_count ++
        
            } else if (outfitStyle == query){
              count ++
              imgURL = doc.data().outfitData.url
              
              // images for dashboard
              //create image tag
              var img = document.createElement('img');
              img.src = imgURL
              img.alt = doc.id
              img.setAttribute("class","img-fluid w-100 shadow-1-strong rounded")

              //create inner dig tag
              var iDiv = document.createElement('div');
              iDiv.setAttribute("class","dashboard-links d-flex align-items-center justify-content-center")
              //create link tag
              var link = document.createElement('a');

              link.href = "showOutfit.html?id=" + doc.id
              link.setAttribute("id", doc.id)
              link.setAttribute("class","glightbox preview-link")
              //create i tag
              var i = document.createElement('i');
              i.setAttribute("class","bi bi-arrows-angle-expand")
              //insert i into link 
              link.appendChild(i)
              //insert link into inner div tag
              iDiv.appendChild(link);
              //create outer div box tag
              var oDiv = document.createElement('div')
              oDiv.setAttribute("class", 'container-fluid dashboard-item mb-4')
              //insert img and inner div box
              oDiv.appendChild(img)
              oDiv.appendChild(iDiv)

              // see count, append accordingly
              if (col_count == 1){
                colDiv1.appendChild(oDiv)
                console.log(colDiv1.innerHTML)
              } else if (col_count == 2){
                colDiv2.appendChild(oDiv)
              } else if (col_count == 3){
                colDiv3.appendChild(oDiv)
              } else if (col_count == 4){
                colDiv4.appendChild(oDiv)
                col_count = 0
              }
              col_count ++
            }
          });

          container.appendChild(colDiv1)
          console.log(container)
          container.appendChild(colDiv2)
          console.log(container)
          container.appendChild(colDiv3)
          console.log(container)
          container.appendChild(colDiv4)
          console.log(container)
          //show # results
          document.getElementById("countResults").innerHTML = count + " results found";
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    } else {
      window.location.href = "index.html";
      console.log("User not authenticated, sign in again.");
    }
  });
}


//load all before query
firebase.auth().onAuthStateChanged((user) => {  
  loadImages("all");
  document.getElementById("all").setAttribute("class", "col filters tablink tablink-active")
});

//user logout
var logout = () => {
  auth
    .signOut()
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      window.location.href = "index.html";
    });
};
