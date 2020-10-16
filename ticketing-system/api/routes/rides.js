const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Ride = require('../models/Ride');

//Get all rides
router.get('/', (req,res,next)=>{
    Ride.find()
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

//Save a Ride
router.post('/', (req, res, next)=>{
    const ride = new Ride({
        _id: new mongoose.Types.ObjectId,
        rideId: req.body.rideId,
        startPoint: req.body.startPoint,
        endPoint: req.body.endPoint,
        ticketAmount: req.body.ticketAmount,
        passengerID: req.body.passengerID,
        date: req.body.date,
        routeId: req.body.routeId
    });
    ride.save()
        .then(result=>{
            console.log(result);
            res.status(200).json({
                createdRide: ride
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Get a Ride by id
router.get('/:rideId', (req,res,next)=>{
    const id = req.params.rideId;
    Ride.find({rideId: id})
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

//Update a ride
router.patch('/:rideId', (req,res,next)=>{
    const id = req.params.rideId;
    const updateOps = {};
    // for(const ops of req.body){
    //     updateOps[ops.propName] = ops.value;
    // }

    Ride.update({rideId: id}, {$set: req.body})
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

//Delete a ride
router.delete('/:rideId', (req,res,next)=>{
    const id = req.params.rideId;

    Ride.remove({rideId: id})
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

module.exports = router;
