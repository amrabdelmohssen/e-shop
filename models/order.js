const mongoose = require('mongoose')

const OrderSchema= new mongoose.Schema({
    orderItems : [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"OrderItems",
        required : true
    }],//{orderItems,phone,status,shippingAddressOne,shippingAddressTwo,country,city,zipCode,totalPrice,user}
    phone: {
        type: String,
        required: true,
      },
    status : {
          type: String,
          required:true,
          default:"pending"
      },
    shippingAddressOne : {
        type: String,
        required: true

    },
    shippingAddressTwo : {
        type: String,

    },
    country: {
        type: String,
        default: "",
      },
    city: {
        type: String,
        default: "",
      },
    
    zipCode : {
          type: String,
          required: true,
      },
    totalPrice :{
          type: Number,
          required: true
      },

    user : {
          type : mongoose.Schema.Types.ObjectId,
          ref : "User",
          required: true
      },
    dateOrdered:{
      type: Date,
      default: Date.now(),
      },
    });
    
OrderSchema.virtual('id').get(function () {
  return this._id.toHexString()
})
OrderSchema.set('toJSON',{
  virtuals: true,
})
const Order = mongoose.model( "Order",OrderSchema)
module.exports = Order;