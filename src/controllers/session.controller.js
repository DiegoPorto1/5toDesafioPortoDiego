
import { generateToken } from "../utils/jwt.js";

const login = async (req, res) => {


    try {
        if (!req.user) {
            return res.status(401).send({ mensaje: "Usuario invalido" });
        }

        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 4320000 //12 hs en mili segundos
        });
        res.status(200).send( token )
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` });
    }
};
const logout = (req, res) => {
    res.clearCookie("jwtCookie");
    res.status(200).send({ resultado: "Usuario deslogueado" });
};

const register = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: "Usuario ya existente" });
        }
        res.status(200).send({ mensaje: "Usuario registrado" });
    } catch (error) {
        res.status(500).send({ mensaje: `Error al registrar usuario ${error}` });
    }
};

export { login, logout,register };