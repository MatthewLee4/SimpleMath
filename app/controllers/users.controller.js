const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');
const { initialize } = require("passport");
//REGISTER
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    // console.log(req.body.password)
    // const hashedPassword = await bcrypt.hash(req.body.password, 10)
    // Create a User
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
  
    // Save User in the database
    User.create(user)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      });
  };

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
  
    User.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
  };

// LOGIN Find a single User with an email/password
exports.findOne = async (req, res) => {
  // console.log(req)
  // console.log(req.email)
  console.log(req.password)
  let user = User.findOne({ where: {email: req.email}})
  .then( async user => {
    if (!user) {
      return null;
    } else {
      console.log(user.password);
      const comparePassword = await bcrypt.compare(req.password, user.password)
      console.log(comparePassword);
      if (comparePassword == true) {
        return user
      }
    }
  })  
return user
  // const comparePassword = await bcrypt.compare(req.body.password, user.password)
    // // Create a User
    // const userObject = {
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: comparePassword
    // };
  
    // User.findOne({ where: { email:userObject.email, password:userObject.password} })
    //   .then(data => {
    //     res.send(data);
    //   })
    //   .catch(err => {
    //     res.status(500).send({
    //       message: err
    //     });
    //   });
  };

// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    User.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with id=" + id
        });
      });
  };

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    User.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
  };

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Users were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all users."
        });
      });
  };

// Find all published Users
exports.findAllPublished = (req, res) => {
    User.findAll({ where: { published: true } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
  };