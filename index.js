import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/auth.routers.js';
import transactionsRouter from './routes/transactions.routers.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

// routes
app.use(authRouter);
app.use(transactionsRouter);

app.listen(5000, () => { console.log('Tô funcionando na porta 5000!') });