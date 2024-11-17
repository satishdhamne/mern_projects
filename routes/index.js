var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');
const passportStrategy = require("passport-local");
const upload = require("./multer")

passport.use(new passportStrategy (userModel.authenticate()));

router.get("/", (req, res) => {
     res.render("index");
})

router.get("/feed", (req, res) => {
     res.render("feed");
})

router.post("/upload", isLoggedIn, upload.single("file"), async (req, res, next) => {
  if(!req.file){
    return res.status(404).send("no file were uploaded");
  }

  let user = await userModel.findOne({ username : req.session.passport.user })

  const filedoc =  await postModel.create({
    creator: user._id,
    imagetext: req.body.imagecaption,
    image: req.body.filename,

   })

  user.posts.push(filedoc._id);
  user.save();

  res.send("done")
  
})

router.get("/login", (req, res) => {

     const failureMsg = req.flash("error"); 
     console.log(failureMsg.length);
     res.render("login", { failureMsg });

})

router.get("/profile", isLoggedIn , async (req, res) => {

const username = req.session.passport.user  // user is unique identity of the user object data, that can be monitered by passport to keep tack the user requests for the subsequent requests 
  
// console.log(req.session.passport);  // once the user is authenticated by the passport, passport stores user object on the session and handles it and now we can access this user object using req.session.passport, here user field uses the username as user field value and if want any other value as unique id we can specify any field like email, _id etc in serializeUser() method

const userdoc = await userModel.findOne({ username }).populate("posts");
res.render("profile", { userdoc });
console.log(userdoc);
})

// AUTHENTICATION

router.post("/register", (req, res) => {

   const userdata = new userModel({

    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email
   })

   userModel.register(userdata, req.body.password, (err, user) => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    })
   }) 
})

router.get("/login",(req , res) => {
  res.render("login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,    // enables the error flash messages 
   // successFlash: true
    
}) ,(req, res) => { 

})

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if(err) return next(err);
    res.redirect("/login");
  })
})


function isLoggedIn(req, res, next){

  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login")
}


// mongodb database 

router.get("/create", async (req, res) => {
  
 const postdoc = await postModel.create({
    title: "msg from uk",
    description: "hi, dad i hope you are good",
    creator: "6714046334ca057e26e00892",
  })

  const user = await userModel.findOne({_id: "6714046334ca057e26e00892"})
  user.posts.push(postdoc._id);
  await user.save();

  res.send(postdoc); 
})

router.get("/userspost", async (req, res) => {
  const usersallpost = await userModel
                             .findOne({_id: '6714046334ca057e26e00892'}) 
                             .populate("posts") 
  res.send(usersallpost);        
})


module.exports = router;
