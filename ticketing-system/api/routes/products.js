const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Product = require('../models/Product');

//Get all products
router.get('/', (req,res,next)=>{
   Product.find()
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

//Save a product
router.post('/', (req, res, next)=>{
   const product = new Product({
      _id: new mongoose.Types.ObjectId,
       name: req.body.name,
       price: req.body.price
   });
   product.save()
       .then(result=>{
           console.log(result);
           res.status(200).json({
               createdProduct: product
            });
        })
       .catch(err=>{
           console.log(err);
           res.status(500).json({
               error: err
           });
       });
});

//Get a product by id
router.get('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
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

//Update a product
router.patch('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    const updateOps = {};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    Product.update({_id: id}, {$set: updateOps})
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

//Delete a product
router.delete('/:productId', (req,res,next)=>{
    const id = req.params.productId;

    Product.remove({_id: id})
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
