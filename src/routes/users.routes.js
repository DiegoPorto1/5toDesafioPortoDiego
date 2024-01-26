import { Router } from "express";
import { passportError, authorization } from "../utils/messagesError.js";
import { userModel } from "../models/user.models.js";
import upload from "../config/multer.js";
import { getAllUsers, getUserById, updateUser, deleteUser, registerUser,requestPasswordReset,resetPassword,uploadUserDocuments } from "../controllers/users.controller.js";

const userRouter = Router();

userRouter.get('/',passportError('jwt'), authorization('admin'),  getAllUsers);
userRouter.get('/:id',passportError('jwt'), authorization('admin'),getUserById);
userRouter.post('/register', registerUser);
userRouter.put('/:id',passportError('jwt'), authorization('admin'), updateUser);
userRouter.delete('/:id', passportError('jwt'), authorization('admin'), deleteUser);

userRouter.post("/password-recovery", requestPasswordReset);

userRouter.post("/reset-password/:token", resetPassword);

userRouter.post("/:id/documents", upload.array('document', 2), uploadUserDocuments);

export default userRouter;



