import express from 'express'
import { addExpenses, retrieveExpenses, deleteExpenses, addProfitLoss } from '../models/Adminisator/financialActivity.js';
import { totalBooking, totalServices, totaProviders, totatlUsers } from '../models/Adminisator/overview.js';


const router = express.Router();

//add expenses
router.post("/AddNewExpence", addExpenses);

//retrieve
router.get("/getExpences", retrieveExpenses)

//delete esxpences
router.delete("/deleteExpneces/:id", deleteExpenses)

//update or create profitLoss
router.post("/AddProfitLoss", addProfitLoss)

//get total booking
router.get("/totBooking", totalBooking)

//totUser
router.get("/totUser", totatlUsers)

//tot service
router.get("/totService", totalServices)

//tot provide
router.get("/totProvider", totaProviders)

export { router as financialActivityRoute }