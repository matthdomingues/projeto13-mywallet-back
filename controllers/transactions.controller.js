import db from "../db.js";
import dayjs from "dayjs";
import { transactionSchema } from "../schemas/schema.js";

// criação das transações
export async function postTransactions(req, res) {
    const { value, description, type } = req.body;
    const { user } = res.locals;

    const validation = transactionSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res
            .status(422)
            .send(validation.error.details.map(detail => detail.message));
    };

    const transaction = {
        value: value,
        description: description,
        type: type,
        date: dayjs().format('DD/MM'),
        userId: user._id
    };

    try {
        await db.collection('transactions').insertOne(transaction);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500)
    };
};

// envio das transações
export async function getTransactions(req, res) {
    const { user } = res.locals;

    try {
        const transactions = await db.collection('transactions').find({ userId: user._id }).toArray();
        res.send(200).status(transactions);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    };
};