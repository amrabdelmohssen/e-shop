const mongoose = require('mongoose')

const OrderItemsSchema= new mongoose.Schema({
    quantity: {
        type:Number,
        required: true
    },
    product : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required : true
    },
  
})

const OrderItems = mongoose.model('OrderItems',OrderItemsSchema)
module.exports = OrderItems;
