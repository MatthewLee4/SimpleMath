module.exports = app => {
    const users = require("../controllers/users.controller.js");
  
    var router = require("express").Router();
  
    // Create a new User
    router.post("/register", users.create);
  
    // Retrieve all Users
    router.get("/", users.findAll);
  
    // Retrieve all published Users
    router.get("/published", users.findAllPublished);
  
    // Retrieve a single User with id
    router.post("/login", users.findOne);
  
    // Update a User with id
    router.put("/:id", users.update);
  
    // Logout
    router.delete("/logout", users.delete);
  
    // Create a new User
    router.delete("/", users.deleteAll);
  
    app.use('/api/users', router);
  };