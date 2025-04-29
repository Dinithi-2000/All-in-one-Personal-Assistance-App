import express from 'express'
import { addExpenses, retrieveExpenses, deleteExpenses, addProfitLoss, retrieveTotatlExpense, updateExpense } from '../models/Adminisator/financialActivity.js';
import { totalBooking, totalServices, totaProviders, totatlUsers } from '../models/Adminisator/overview.js';
import { addIncome, retreiveTotalRevenue, retrieveRevenue, updateRevenue, deleteRevenue } from '../models/Adminisator/Income.js';

import { getDeduction, getSalaryDetails, TopEmployee, updteRate } from '../models/Adminisator/Salary.js';
import { salaryMail } from '../services/salaryMail.js';


const router = express.Router();

//add expenses
router.post("/AddNewExpence", addExpenses);

//retrieve
router.get("/getExpences", retrieveExpenses)

//retrieve expense by month
router.get("/expensesMonth", retrieveTotatlExpense)

//update
router.post("/updateExpense", updateExpense)
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

//add income
router.post("/addRevenue", addIncome)

//retrieve income
router.get("/retrieveRevenue", retrieveRevenue)

//update revenue
router.post("/updateRevenue", updateRevenue)

//delete 
router.delete("/deleteRevenue/:id", deleteRevenue)

//retreieve total
router.get("/getTotal", retreiveTotalRevenue)


//salary details
router.get("/salaryDetail", getSalaryDetails)

router.post("/sendMail", salaryMail)

router.get("/getList", getDeduction)

router.post("/updateSalary", updteRate)

router.get("/topEarners", TopEmployee)

export { router as financialActivityRoute }