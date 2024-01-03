import { userModel } from "../models/user.models.js";

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (req.session.login) {
            res.status(200).send({ resultado: 'Login ya existente' });
        }

        const user = await userModel.findOne({ email: email });

        if (user) {
            if (user.password == password) {
                req.session.login = true;
                res.redirect('rutaProductos', 200, { 'info': 'user' });
            } else {
                res.status(401).send({ resultado: 'Contraseña no válida', message: password });
            }
        } else {
            res.status(404).send({ resultado: 'Not Found', message: user });
        }
    } catch (error) {
        res.status(400).send({ error: `Error en Login: ${error}` });
    }
};

const logout = (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }

    res.redirect('rutaLogin', 200, { resultado: 'Usuario deslogueado' });
};

export { login, logout };