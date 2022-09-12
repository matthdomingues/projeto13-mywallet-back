import db from "../db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { loginSchema, registerSchema } from "../schemas/schema.js";

export async function SignUp(req, res) {
    console.log(db);
    const { nome, email, senha, confirmaSenha } = req.body;

    const register = {
        nome: nome,
        email: email,
        senha: senha,
        confirmaSenha: confirmaSenha
    };

    const validation = registerSchema.validate(register, { abortEarly: false });

    if (validation.error) {
        return res
            .status(422)
            .send(validation.error.details.map(detail => detail.message));
    };

    try {
        const passwordHash = bcrypt.hashSync(senha, 10);
        const newUser = { nome: nome, email: email, senha: passwordHash };
        const existente = await db.collection('users').findOne({ email });

        if (!existente) {
            await db.collection('users').insertOne(newUser);
            return res.sendStatus(201);
        } else {
            return res.sendStatus(409);
        };

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };
};

export async function SignIn(req, res) {
    const { email, senha } = req.body;

    const validation = loginSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res
            .status(422)
            .send(validation.error.details.map(detail => detail.message));
    };

    try {
        const user = await db.collection('users').findOne({ email });

        if (!user) return res.sendStatus(404);

        if (user && bcrypt.compareSync(senha, user.senha)) {
            const token = uuid();
            await db.collection("sessions").insertOne({ token, userId: user._id, token });
            res.status(200).send({ token, nome: user.nome });
        } else {
            res.sendStatus(404);
        };

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};