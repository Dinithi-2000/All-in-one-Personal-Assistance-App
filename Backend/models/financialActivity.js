import asyncHandler from "express-async-handler"
import { prisma } from "../config/prismaConfig.js"

//Add expenses
export const addExpenses = asyncHandler(async (req, res) => {

    const { Expense, Amount } = req.body;
    try {
        const addDetails = await prisma.expenses.create({
            data: {
                Expense: Expense,
                Amount: Amount,
            }

        })
        res.status(200).json({ message: "Successfully added.", addDetails });
    } catch (error) {
        console.error("prossesing Error");
        res.status(500).json({ message: "Error occured when processing expenses." });
    }
})

//retrieve expense details
export const retrieveExpenses = asyncHandler(async (req, res) => {

    try {
        const getDetails = await prisma.expenses.findMany();

        res.send({ expenses: getDetails });
    } catch (error) {
        console.error("Processing error");
        res.status(500).json({ message: "retrieve expence occured error" });
    }

})
//reove expenses
export const deleteExpenses = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        //delete
        const deleteDetail = await prisma.expenses.delete({
            where: {
                id: id
            }
        })
        res.status(200).json({ message: "Successfully deleted", deleteDetail });
    } catch (error) {
        console.error("Processing error");
        res.status(400).json({ message: "occured delete error", error });
    }
})

