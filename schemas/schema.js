import joi from "joi";

export const registerSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    senha: joi.string().required(),
    confirmaSenha: joi.ref('senha')
});

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().required()
});

export const transactionSchema = joi.object({
    type: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required()
});