import { Schema, model } from "mongoose";

const messagesSchema = new Schema({

    email:{
        type: String,
        required: true 
    },
    message: {
     type: String,
    required: true
    },
    postTime: {
        type: Date,
        default: Date.now
    }
})

cartSchema.pre('findOne', function () {
    this.populate('products.id_prod')
})

export const messageModel = model('messages', messagesSchema)