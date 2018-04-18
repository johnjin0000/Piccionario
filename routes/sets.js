const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');

//Bring in Models
let Words = require('../models/set');
let User = require('../models/user');

//Get add set page
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('new_set');
});

//receive info from add set page
router.post('/add', function(req,res){
req.checkBody('title','Title is required').notEmpty();
req.checkBody('word','Word is empty').notEmpty();

//Get Errors
let errors = req.validationErrors();

if(errors){
  res.render('new_set',{
    errors:errors
  });
} else {
    let set = new Words();
    set.title = req.body.title;
    set.author = req.user._id;
    set.words = req.body.word;



    set.save(function(err){
      if(err){
        console.log(err);
        return;
      }
      else {
        req.flash('success','Set Added');
        res.redirect('/');
      }
    });
  }
});

router.get('/play/:id', ensureAuthenticated, function(req,res){
  Words.findById(req.params.id, function(err, set){
      User.findById(set.author, function(err, user){
        res.render('play', {
          set: set,
          author: user.name,
          user: req.user.name
        });
      });
    });
});


//Get Single Set
router.get('/:id', function(req,res){
  Words.findById(req.params.id, function(err, set){
      User.findById(set.author, function(err, user){
        res.render('set', {
          set: set,
          author: user.name
        });
      });
    });
});



// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
