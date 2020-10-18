const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Card = require('../models/Card');

//Get all card
router.get('/', (req,res,next)=>{
    res.status(200).json({massege: 'get all card'})
});

//Save a card
router.post('/', (req, res, next)=>{
    res.status(200).JSON({massege: 'save card'})
});

//Get a card by id
router.get('/:cardId', (req,res,next)=>{
    res.status(200).JSON({massege: 'get a card'})
});

//Update a card
router.patch('/:cardId', (req,res,next)=>{
    res.status(200).JSON({massege: 'update card'})
});

//Delete a card
router.delete('/:cardId', (req,res,next)=>{
    res.status(200).JSON({massege: 'delete card'})
});

module.exports = router;
