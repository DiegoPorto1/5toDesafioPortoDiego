import { userModel } from "../models/user.models.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).send({ respuesta: 'OK', mensaje: users });
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar usuarios', mensaje: error });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user });
        } else {
            res.status(404).send({ respuesta: 'Error en consultar usuario', mensaje: 'User not Found' });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en consultar usuario', mensaje: error });
    }
};

const createUser = async (req, res) => {
    const { nombre, apellido, edad, email, password } = req.body;
    try {
        const respuesta = await userModel.create({ nombre, apellido, edad, email, password });
        res.status(200).send({ respuesta: 'OK', mensaje: respuesta });
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear usuario', mensaje: error });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, edad, email, password } = req.body;
    try {
        const user = await userModel.findByIdAndUpdate(id, { nombre, apellido, edad, email, password });
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user });
        } else {
            res.status(404).send({ respuesta: 'Error en actualizar usuario', mensaje: 'User not Found' });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en actualizar usuario', mensaje: error });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findByIdAndDelete(id);
        if (user) {
            res.status(200).send({ respuesta: 'OK', mensaje: user });
        } else {
            res.status(404).send({ respuesta: 'Error en eliminar usuario', mensaje: 'User not Found' });
        }
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en eliminar usuario', mensaje: error });
    }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };