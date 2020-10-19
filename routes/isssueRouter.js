const express = require("express")
const issueRouter = express.Router()
const Issue = require('../models/Issue.js')

// Get All Issues
issueRouter.get("/", (req, res, next) => {
  Issue.find((err, issue) => {
    if(err){
      res.status(500)
      return next(err)
    }
    return res.status(200).send(issue)
  })
})

// Get issues by user id
issueRouter.get("/user", (req, res, next) => {
  Issue.find({ user: req.user._id }, (err, issue) => {
    if(err){
      res.status(500)
      return next(err)
    }
    return res.status(200).send(issue)
  })
})

// Add new Issue
issueRouter.post("/", (req, res, next) => {
  req.body.user = req.user._id
  const newIssue = new Issue(req.body)
  newIssue.save((err, savedIssue) => {
    if(err){
      res.status(500)
      return next(err)
    }
    return res.status(201).send(savedIssue)
  })
})

// Delete Issue
issueRouter.delete("/:issueId", (req, res, next) => {
  Issue.findOneAndDelete(
    { _id: req.params.issueId},
    (err, deletedIssue) => {
      if(err){
        res.status(500)
        return next(err)
      }
      return res.status(200).send(`Successfully delete issue: ${deletedIssue.title}`)
    }
  )
})
Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
      }
  }
  return this;
};

// Update Issue
issueRouter.put("/:issueId", async (req, res, next) => {
  // console.log('req:', req.params.issueId);
  // console.log(req.user._id)
  // console.log(req.body)
  // let something = await Issue.findOne({ _id: req.params.issueId, user: req.user._id });
  // console.log("somthing:", something);
  Issue.findOneAndUpdate(
    { _id: req.params.issueId },
    req.body,
    { new: true, upsert: true },
    (err, updatedIssue) => {
      // {updatedIssue.voters = updatedIssue.voters.remove(req.user.username)}
      // updatedIssue.voters = updatedIssue.voters.remove(req.user.username)
      console.log('update', updatedIssue)
      console.log('err', err);
      if(err){
        res.status(500)
        return next(err)
      }
      return res.status(201).send(updatedIssue)
    }
  )
})

module.exports = issueRouter