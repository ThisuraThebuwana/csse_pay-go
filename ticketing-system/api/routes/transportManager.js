const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const TransportManager = require('../models/TransportManager');

//Get all TransportManager
router.get('/', (req,res,next)=>{
    res.status(200).json({massege: 'get all transportManager'})
});

//Save a TransportManager
router.post('/', (req, res, next)=>{
    res.status(200).JSON({massege: 'save transportManager'})
});

//Get a TransportManager by id
router.get('/:transportManagerId', (req,res,next)=>{
    res.status(200).JSON({massege: 'get a transportManager'})
});

//Update a TransportManager
router.patch('/:transportManagerId', (req,res,next)=>{
    res.status(200).JSON({massege: 'update transportManager'})
});

//Delete a TransportManager
router.delete('/:transportManagerId', (req,res,next)=>{
    res.status(200).JSON({massege: 'delete transportManager'})
});

module.exports = router;
