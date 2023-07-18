const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            require:[true, "Please Enter Your Address"]
        },

        city:{
            type:String,
            require:[true, "Please Enter Your City"]
        },

        state:{
            type:String,
            require:[true, "Please Enter Your State"]
        },

        country:{
            type:String,
            require:[true, "Please Enter Your Country"]
        },

        pinCode:{
            type:Number,
            required:[true, "Please Enter Your PinCode Number"]
        },

        phoneNo:{
            type:Number,
            required:[true, "Please Enter Your Phone Number"]
        },
    },

    orderItems:[
        {
            name:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            image:{
                type:String,
                required:true
            },
            product:{
                type:mongoose.Schema.ObjectId,
                ref:"Product",
                required:true
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },

    paymentInfo:{
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        },
    },
    
    paidAt:{
        type:Date,
        required:true
    },

    itemsPrice:{
        type:Number,
        default:0,
        required:true
    },

    taxPrice:{
        type:Number,
        default:0,
        required:true
    },

    shippingPrice:{
        type:Number,
        default:0,
        required:true
    },

    totalPrice:{
        type:Number,
        default:0,
        required:true
    },

    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },

    deliveredAt:Date,

    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = new mongoose.model("Order", orderSchema);