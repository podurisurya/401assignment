const express = require('express');
const app = express();
const port = 3002;

const { initializeApp, cert} = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');


var serviceAccount = require("./key.json");

initializeApp({
    credential:cert(serviceAccount),
})
const db=getFirestore();
app.set('view engine', 'ejs');

app.get("/",(req,res) => {
    res.send("hello world!");
})

app.get('/signin', (req, res) => {
  res.render('signin')
})

app.get('/signinsubmit', (req, res) => {
    const email=req.query.email;
    const password=req.query.password;
    
    db.collection("users")
     .where("email","==",email)
     .where("password","==",password)
     .get()
    .then((docs) => {
        if(docs.size>0){
            var usersData = [];
             db.collection('users')
             .get()
             .then((docs) => {
                 docs.forEach((doc) => {
                     usersData.push(doc.data());
                 });
             })
            .then(() => {
             console.log(usersData);
             res.render("home",{userData:usersData});
            })
          }
          else{
             res.send("login failure");
          }
      })
            
})

app.get('/signupsubmit', (req, res) => {
     const full_name=req.query.full_name;
     //console.log("full_name: ",full_name);
     //const last_name=req.query.last_name;
     //console.log("last_name: ",last_name);
     const email=req.query.email;
     //console.log("email: ",email);
     const password=req.query.password;
     //console.log("password: ",password);
     const dob=req.query.dob;
     const acceptTerms=req.query.acceptTerms;

     db.collection('users').add({
        name: full_name,
        email:email,
        password:password,
        dob:dob,
        acceptTerms:acceptTerms,
     }).then(() => {
        //console.log("User added successfully");
        res.send("signup successfully");
     })
    //  .catch(error => {
    //     console.error("Error signing up:", error);
    //     res.status(500).send("Error signing up");
    //  });
})
  

app.get('/signup', (req, res) => {
    res.render('signup')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})