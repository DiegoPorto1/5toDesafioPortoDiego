import { userModel } from "../models/user.models.js";
import { sendRecoveryMail } from "../config/nodemailer.js";
import crypto from 'crypto';


const getAllUsers = async (req, res) => {
    try {
        const user = await userModel.find();

        if (user) {
            return res.status(200).send(user);
        }
        res.status(400).send({ error: "Usuario no encontrado" });
    } catch (error) {
        res.status(500).send({ error: `Error en consultar el usuario ${error}` });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const userId = await userModel.findById(id);
        if (userId) {
            return res.status(200).send(userId);
        }
        res.status(404).send({ error: "Usuario no encontrado" });
    } catch (error) {
        res.status(500).send({ error: `Error en consultar usuario ${error}` });
    }
};

const registerUser = async (req, res) => {
    console.log('Solicitud recibida en registerUser');
    const { first_name, last_name, age, email, password, role } = req.body;
    
    try {
        // Verifica si se proporciona un rol válido
        const rolesPermitidos = ['admin', 'user'];
        const rolValido = rolesPermitidos.includes(role);

        if (!rolValido) {
            return res.status(400).send({ respuesta: 'Error', mensaje: 'Rol no válido' });
        }

        const userObject = {
            first_name,
            last_name,
            age,
            email,
            password,
            role: role || 'user',  // Asigna el rol proporcionado o 'user' por defecto
        };

        console.log('Usuario a crear:', userObject);

        const newUser = await userModel.create(userObject);

        console.log('Respuesta de la creación del usuario:', newUser);

        res.status(200).send({ respuesta: 'OK', mensaje: newUser });
    } catch (error) {
        console.error('Error en crear usuario:', error);
        res.status(400).send({ respuesta: 'Error en crear usuario', mensaje: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, age, email, password } = req.body;

    try {
        const actUser = await userModel.findByIdAndUpdate(id, {
            first_name,
            last_name,
            age,
            email,
            password,
        });
        if (actUser) {
            return res.status(200).send(actUser);
        }
        res.status(404).send({ error: "Usuario no encontrado" });
    } catch (error) {
        res.status(500).send({ error: `Error en actualizar el usuario ${error}` });
    }
};


const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findByIdAndDelete(id);
        if (user) {
            res.status(200).send({ user });
        } else {
            res.status(404).send({ error: "Error en eliminar usuario" });
        }
    } catch (error) {
        res.status(400).send({ error: "Error en eliminar usuario" });
    }
};


const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        //Token único con el fin de que no haya 2 usuarios con el mismo link de recuperación
        const token = crypto.randomBytes(20).toString('hex');
        recoveryLinks[token] = { email: email, timestamp: Date.now() };
        const recoveryLink = `http://localhost:4000/api/users/reset-password/${token}`;
        sendRecoveryMail(email, recoveryLink);
        res.status(200).send('Correo de recuperación enviado');
    } catch (error) {
        res.status(500).send(`Error al enviar el mail ${error}`);
    }
};


const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    try {
        const linkData = recoveryLinks[token];
        if (linkData && Date.now() - linkData.timestamp <= 3600000) {
            console.log(newPassword, confirmNewPassword);
            const { email } = linkData;
            console.log(email);
            console.log(token);
            if (newPassword == confirmNewPassword) {
                // Modificar usuario con nueva contraseña
                delete recoveryLinks[token];
                res.status(200).send('Contraseña modificada correctamente');
            } else {
                res.status(400).send('Las contraseñas deben ser idénticas');
            }
        } else {
            res.status(400).send('Token inválido o expirado. Pruebe nuevamente');
        }
    } catch (error) {
        res.status(500).send(`Error al modificar contraseña ${error}`);
    }
};


const uploadUserDocuments = async (req, res) => {
    const userId = req.params.uid;
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).send('No se subieron archivos.');
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send('Usuario no encontrado.');
        }
        const updatedDocuments = files.map(file => ({
            name: file.originalname,
            reference: file.path
        }));
        user.documents.push(...updatedDocuments);
        await user.save();
        res.status(200).send('Imagen cargada');
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).send('Error al subir documentos');
    }
};

export { getAllUsers, getUserById, registerUser, updateUser, deleteUser,requestPasswordReset,uploadUserDocuments,resetPassword, };