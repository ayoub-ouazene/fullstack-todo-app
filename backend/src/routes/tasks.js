const { Router } = require("express");
const express = require("express");
const { User } = require("../modules/users.js");
const { query, validationResult, body } = require("express-validator");

const router = Router();
router.use(express.json());



//getting id of last user

async function last_id(userID) {
  const user = await User.findOne({ id: userID });
  if (!user || !user.tasks || user.tasks.length === 0) {
    return null; // no tasks
  }

  const lastTask = user.tasks.sort((a, b) => b.id - a.id)[0]; 
  return lastTask.id;
}

//confirmation

function validateUser(req,res,next){

      if (!req.session.user) {
        console.log("Your session is not active.");
        return res.status(401).send("Your session is not active.");
    }

    if (req.session.user.isLogging === false) {
        console.log("You must be logged in to perform this action.");
        return res.status(401).send("You must be logged in to perform this action.");
    }

    next();

}



//get all tasks of special user 

router.get("/",validateUser, async (req, res) => {

  const user = await User.findOne({ id: req.session.user.id});
  if (!user) {
    return res.status(404).send("user not found");
  } 
  else {
    if(user.tasks.length == 0)
    {
       return  res.status(200).send("no task for this user");
    }

    res.status(200).send({
      tasks: user.tasks,
        });
  }
});


//add a task to list of tasks of special user

router.post(
  "/",
  validateUser,
  body("description").notEmpty().withMessage(" description must not be empty"),
  body("done").isBoolean().withMessage("done must be boolean"),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send("task data is not valid");
    }
    try {
      const user = await User.findOne({ id: req.session.user.id });
      if (!user) {
        return res.status(404).send("user not found");
      }
      const last_task = await last_id(req.session.user.id);
      const newTask = {
        id: last_task + 1,
        date: Date.now(),
        ...req.body,
      };

      user.tasks.push(newTask);
      await user.save();

      res.status(201).json(newTask);
    } catch (error) {
      console.log("error in adding task");
      res.status(400).send("error in adding task");
    }
  }
);
 
//delete a task/tasks from list of tasks of special user

router.delete(
  "/",
  validateUser,
  query("taskId").optional().isInt().withMessage("the query should be id of type integer"),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send("query must be an id number");
    }
    try {
      if (!req.query.taskId) 
        {
        const deleteTasks = await User.updateOne(
          { id: req.session.user.id },
          { $set: { tasks: [] } }
        );

        if (deleteTasks.modifiedCount === 0) {
          return res.status(404).send("User or tasks not found.");
        }
      } 
      else 
        {
        const deleteTask = await User.updateOne(
          { id: req.session.user.id},
          { $pull: { tasks: { id: parseInt(req.query.taskId) } } }
        );

        if (deleteTask.modifiedCount === 0) {
          return res.status(404).send("User or task not found.");
        }
      }
      res.status(200).send("deleting task successfully");
    } catch (error) {
      res.status(400).send("failed to delete task");
    }
  }
);

//modify a task of special user( make it as done or modify the description)

router.patch(
 "/",
 validateUser,
  body("description").optional(),
  body("done").optional().isBoolean().withMessage("done must be boolean"),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send("task data is not valid");
    }
    try {
      const { description, done } = req.body;

      const updateObj = {};
      if (description) updateObj["tasks.$.description"] = description;
      if (done !== undefined) updateObj["tasks.$.done"] = done;

      if(Object.keys(updateObj).length === 0)
      {
        return res.status(400).send("no valid data was provided");
      }

      const updateTask = await User.updateOne(
        { id: req.session.user.id , "tasks.id": req.query.taskId },
        { $set: updateObj }
      );

      if (updateTask.modifiedCount === 0) {
        return res.status(404).send("User or task not found");
      }

      res.status(200).send("successful updating");
    } catch (error) {
      res.status(400).send("failed to update task");
      console.log("failed to update task");
    }
  }
);

module.exports = router;
