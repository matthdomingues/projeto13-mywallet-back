import { Router } from "express";
import { getTransactions, postTransactions } from "../controllers/transactions.controller.js";
import { hasUser } from "../middleware/auth.middleware.js";

const transactionsRouter = Router();

transactionsRouter.use(hasUser)

// recebimento de transações
transactionsRouter.post('/transactions', postTransactions);
// envio de transações
transactionsRouter.get("/transactions", getTransactions);

export default transactionsRouter;