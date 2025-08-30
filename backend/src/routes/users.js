// routes/users.js
const { Router } = require('express');
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
require('dotenv').config();

// adding models
const { User } = require('../modules/users.js');

const router = Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// hash function
async function hashInput(input) {
  const saltRounds = 10;
  const hashedValue = await bcrypt.hash(input, saltRounds);
  return hashedValue;
}


//getting id of last user

async function last_id(){
   const last_user= await User.findOne().sort({id:-1});
   return last_user?last_user.id : null;
}


//confirmation

function validateUser(req,res,next){

      if (!req.session.user) {
        console.log("Your session is not active.");
        return res.status(401).send("Your session is not active.");
    }
    next();

}



//get all users from the data base 

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    if (!users || users.length === 0) {
      console.log('no available users');
      return res.status(404).send('no available users');
    }
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(400).send('bad request');
  }
});


//add user to the data base -- sign up
router.post('/', 
    body("name").notEmpty().withMessage("name must not be empty").isString().withMessage("name must be string") ,
     body("email").isEmail().withMessage("email is incorrect") ,
      body("password").notEmpty().withMessage("password shoud not be empty") ,
      async (req,res)=>{ 

        const errors = validationResult(req); 
            if(!errors.isEmpty()) { 
                console.log(errors);
                return res.status(400).send("wrong data"); 
            }
        try 
        {      
             const count = await last_id();
             const passwd = await hashInput(req.body.password);
              const newUser = new User({ 
                id : count+1,
                 name : req.body.name,
                  email : req.body.email, 
                  password : passwd,
                   tasks : req.body.tasks 
                }); 
                    
            
                 await newUser.save(); 
                 req.session.user = 
                 {
                   id: newUser.id,
                    isLogging: true
                }; 
                 
                
                const { password, ...userWithoutPassword } = newUser.toObject(); 
                res.status(201).json({ "user" : userWithoutPassword, });
             } 
             catch(error) { 
                console.log("error in creating user"); 
                res.status(400).send("error in creating user");
             }
             }
            );


// DELETE a user from the database

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

    
        const deletedUser = await User.findOneAndDelete({ id: userId });

        if (!deletedUser) {
            console.log(`User with ID ${userId} not found.`);
            return res.status(404).send('User not found!');
        }

    
        console.log(`User with ID ${userId} deleted successfully.`);
        
        req.session.destroy();
        res.status(200).json({ 
            message: 'User deleted successfully.',
            deletedUser: deletedUser 
        });

    } catch (error) {
        console.error('An error occurred while trying to delete a user:', error);
        res.status(500).send('An internal server error occurred.');
    }
});

//update information of user 

router.patch(
  '/',
  body('name').optional(),
  body('email').optional().isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send('wrong data');
    }

    try {
      await User.updateOne(
        { id: req.body.id },
        { $set: { name: req.body.name, email: req.body.email } }
      );

      res.status(200).send('updating user succefully');
    }
     catch (error) {
      console.log('failed to update user ');
      res.status(400).send('failed to update user');
    }
  }
);
 

//check if user exist in db -- log in

router.post('/login', async (req, res) => {
  
  const user = await User.findOne({
    email : req.body.email
  });


  if (!user) {
    console.log('invalid email');
    return res.status(403).send('Invalid email');
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) {
    console.log('invalid password');
    return res.status(403).send('invalid password');
  }

   console.log("correct password");
   req.session.user = {
       id: user.id,
      isLogging: true,
    };
    // console.log(req.session);
         
   

  return res.status(200).send('loggin succefully');
});

// destroy session -- log out

router.post('/logout', 
    validateUser, 
    (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send("Failed to destroy session");
            }

            res.status(200).send("Session destroyed successfully");
        });
    }
);
module.exports = router;
