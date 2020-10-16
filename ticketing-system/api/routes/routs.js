const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Route = require('../models/Route');

//Get all routes
router.get('/', (req,res,next)=>{
    Route.find()
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

//Save a Route
router.post('/', (req, res, next)=>{
    const route = new Route({
        _id: new mongoose.Types.ObjectId,
        routeId: req.body.routeId,
        busStops: req.body.busStops
    });
    route.save()
        .then(result=>{
            console.log(result);
            res.status(200).json({
                createdRoute: route
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
router.get('/:routeId', (req,res,next)=>{
    const id = req.params.routeId;
    Route.find({routeId: id})
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
//
// //Update a passenger
// router.patch('/:passengerId', (req,res,next)=>{
//     const id = req.params.passengerId;
//     const updateOps = {};
//     // for(const ops of req.body){
//     //     updateOps[ops.propName] = ops.value;
//     // }
//
//     Passenger.update({passengerID: id}, {$set: req.body})
//         .exec()
//         .then(result=>{
//             console.log(result);
//             res.status(200).json(result);
//         })
//         .catch(err=>{
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
//
// });
//
// //Delete a passenger
// router.delete('/:passengerId', (req,res,next)=>{
//     const id = req.params.passengerId;
//
//     Passenger.remove({passengerID: id})
//         .exec()
//         .then(result=>{
//             console.log(result);
//             res.status(200).json(result);
//         })
//         .catch(err=>{
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
//
// });

module.exports = router;
