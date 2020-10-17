const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Passenger = require('../models/Passenger');

//Get all passengers
router.get('/', (req,res,next)=>{
    Passenger.find()
        .exec()
        .then(doc=>{
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Save a passenger
router.post('/', (req, res, next)=>{
    const passenger = new Passenger({
        _id: new mongoose.Types.ObjectId,
        passengerID: req.body.passengerID,
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        nic: req.body.nic,
        mobileNo: req.body.mobileNo,
        availableAmount: req.body.availableAmount,
        holdAmount: req.body.holdAmount
    });
    passenger.save()
        .then(result=>{
            console.log(result);
            res.status(200).json({
                createdPassenger: passenger
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Get a passenger by id
router.get('/:passengerId', (req,res,next)=>{
    const id = req.params.passengerId;
    Passenger.find({passengerID: id})
        .exec()
        .then(doc=>{
            console.log(doc);
            if(doc){
                res.status(200).json(doc);
            }else{
                res.status(404).json({
                    message: 'No valid entry found for provided id'
                });
            }
            res.status(200).json(doc);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

//Update a passenger
router.patch('/:passengerId', (req,res,next)=>{
    const id = req.params.passengerId;
    const updateOps = {};
    // for(const ops of req.body){
    //     updateOps[ops.propName] = ops.value;
    // }

    Passenger.update({passengerID: id}, {$set: req.body})
        .exec()
        .then(result=>{
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

//Delete a passenger
router.delete('/:passengerId', (req,res,next)=>{
    const id = req.params.passengerId;

    Passenger.remove({passengerID: id})
        .exec()
        .then(result=>{
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

//passenger login
router.get('/login/:username/:password', (req,res,next)=>{
    const id = req.params.username;
    const pw = req.params.password;
    Passenger.find({username: id})
        .exec()
        .then(doc=>{
            console.log(doc);
            if(doc){
                if(doc[0].password===pw){
                    console.log("match");
                    res.status(200).json({
                        message: 'success'
                    });
                }else{
                    console.log("not match");
                    res.status(200).json({
                        message: 'fail'
                    });
                }
            }else{
                res.status(404).json({
                    message: 'No valid entry found for provided id'
                });
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

module.exports = router;
