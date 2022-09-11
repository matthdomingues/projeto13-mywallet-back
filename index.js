import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => { db = mongoClient.db("my-wallet") });

const registerSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().min(4).max(8).required(),
    confirmaSenha: joi.ref('senha')
});

app.post('/sign-up', async (req, res) => {
    const { nome, email, senha, confirmaSenha } = req.body;

    const register = {
        nome: nome,
        email: email,
        senha: senha,
        confirmaSenha: confirmaSenha
    };

    const validation = registerSchema.validate(register);

    if (validation.error) {
        return res.sendStatus(422).send(validation.error.details[0].message);
    };

    try {
        const passwordHash = bcrypt.hashSync(senha, 10);
        const newUser = { nome: nome, email: email, senha: passwordHash };
        const existente = await db.collection('users').findOne(email);

        if (!existente) {
            await db.collection('users').insertOne(newUser);
            return res.sendStatus(201);
        } else {
            return res.sendStatus(409);
        };

    } catch (error) {
        return res.sendStatus(409);
    }
});

app.post("/sign-in", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await db.collection('users').findOne(email);

        if (user && bcrypt.compareSync(senha, user.senha)) {

            const token = uuid();

            await db.collection("sessions").insertOne({
                userId: user._id,
                token
            });

            res.status(200).send(token);
        } else {
            res.sendStatus(409)
        };
    } catch (error) {
        res.sendStatus(500)
    };
});

app.listen(5000, () => { console.log('Tô funcionando na porta 5000!') });