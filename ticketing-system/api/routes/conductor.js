const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Conductor = require('../models/Conductor');

//Get all conductor
router.get('/', (req,res,next)=>{
    res.status(200).json({massege: 'get all conductor'})
});

//Save a conductor
router.post('/', (req, res, next)=>{
    res.status(200).JSON({massege: 'save conductor'})
});

//Get a conductor by id
router.get('/:conductorId', (req,res,next)=>{
    res.status(200).JSON({massege: 'get a conductor'})
});

//Update a conductor
router.patch('/:conductorId', (req,res,next)=>{
    res.status(200).JSON({massege: 'update conductor'})
});

//Delete a conductor
router.delete('/:conductorId', (req,res,next)=>{
    res.status(200).JSON({massege: 'delete conductor'})
});

module.exports = router;
