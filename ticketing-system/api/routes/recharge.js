const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Recharge = require('../models/Recharge');

//Get all recharge
router.get('/', (req,res,next)=>{
    res.status(200).json({massege: 'get all recharge'})
});

//Save a recharge
router.post('/', (req, res, next)=>{
    res.status(200).JSON({massege: 'save recharge'})
});

//Get a recharge by id
router.get('/:rechargeId', (req,res,next)=>{
    res.status(200).JSON({massege: 'get a recharge'})
});

//Update a recharge
router.patch('/:rechargeId', (req,res,next)=>{
    res.status(200).JSON({massege: 'update recharge'})
});

//Delete a recharge
router.delete('/:rechargeId', (req,res,next)=>{
    res.status(200).JSON({massege: 'delete recharge'})
});

module.exports = router;
