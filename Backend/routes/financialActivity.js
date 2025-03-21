import express from 'express'
import { addExpenses, retrieveExpenses, deleteExpenses } from '../models/financialActivity.js';


const router = express.Router();

//add expenses
router.post("/AddNewExpence", addExpenses);

//retrieve
router.get("/getExpences", retrieveExpenses)

//delete esxpences
router.delete("/deleteExpneces/:id", deleteExpenses)

export { router as financialActivityRoute }