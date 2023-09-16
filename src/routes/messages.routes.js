import { Router } from "express";
import { messageModel } from "../models/messages.models";

const messageRouter =  Router ();

messageRouter.get("/", async (req, res)=> {
    const {limit} = req.query;
    try {
        const getMessages = await messageModel.find().limit(limit);
        res.status(200).send({response: "ok", mesaje: getMessages});
    } catch (error) {
        res.status(400).send({response:"Error", message: error});
    }
});

messageRouter.post ("/", async (req, res)=>{
    const {email, message} = req.body;
    try{
        const message = await messageModel.create({email, message});
        res.status(200).send({response:"Mensaje enviado", mensaje: messages});
    } catch (error ) {
        res.status(400).send({response:"Error", message:error});    }

})

export default messageRouter