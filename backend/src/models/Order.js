const mongoose = require("mongoose");

const customerOrderSchema = new mongoose.Schema(
{
    orderNumber:{
        type:String,
        unique:true
    },

    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    vendorOrders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"VendorOrder"
        }
    ],

    shippingAddress:{
        fullName:String,
        phone:String,
        country:String,
        province:String,
        city:String,
        address:String,
        postalCode:String,
    },

    paymentMethod:{
        type:String,
        enum:["COD","Stripe","JazzCash","EasyPaisa"],
        default:"COD"
    },

    paymentStatus:{
        type:String,
        enum:["pending","paid","failed","refunded"],
        default:"pending"
    },

    subtotal:Number,

    shippingFee:{
        type:Number,
        default:0
    },

    tax:{
        type:Number,
        default:0
    },

    totalAmount:Number

},
{
    timestamps:true
});

module.exports = mongoose.model("Order", customerOrderSchema);