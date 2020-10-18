const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const QRCode = require('qrcode');

const QR = require('../models/QR');

//Get all QR
router.get('/', (req,res,next)=>{
    QR.find()
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

//Save a QR
router.post('/', (req, res, next)=>{
    const qr = new QR({
        _id: new mongoose.Types.ObjectId,
        qrId: req.body.qrId,
        code: req.body.code,
        rideId: req.body.rideId
    });
    qr.save()
        .then(result=>{
            console.log(result);
            res.status(200).json({
                createdQR: qr
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//Get a QR by id
router.get('/:qrId', (req,res,next)=>{
    const id = req.params.qrId;
    QR.find({qrId: id})
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

//Update a QR
router.patch('/:qrId', (req,res,next)=>{
    const id = req.params.qrId;
    const updateOps = {};
    // for(const ops of req.body){
    //     updateOps[ops.propName] = ops.value;
    // }

    QR.update({qrId: id}, {$set: req.body})
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

//Delete a QR
router.delete('/:qrId', (req,res,next)=>{
    const id = req.params.qrId;

    QR.remove({qrId: id})
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

//generate qr
router.post('/generateqr', (req, res, next)=>{

    let qrurl="";

    let obj= {
        "rideId": req.body.rideId,
        "startPoint": req.body.startPoint,
        "endPoint": req.body.endPoint,
        "ticketAmount": req.body.ticketAmount,
        "passengerId": req.body.passengerID,
        "date": req.body.date,
        "routeId": req.body.routeId
    };
    let str = JSON.stringify(obj);
    QRCode.toDataURL(str,{errorCorrectionLevel:'H'},function (err, url) {

        const qr = new QR({
            _id: new mongoose.Types.ObjectId,
            qrId: req.body.qrId,
            code: url,
            rideId: req.body.rideId
        });
        qr.save()
            .then(result=>{
                console.log(result);
                res.status(200).json({
                    createdQR: qr,
                    qrUrl: url
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });


});

module.exports = router;
