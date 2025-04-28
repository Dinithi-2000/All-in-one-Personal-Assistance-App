import asyncHandler from "express-async-handler"
import { prisma } from "../../config/prismaConfig.js"


//add income
export const addIncome = asyncHandler(async (req, res) => {

    const { date, income, amount } = req.body;

    try {
        const ddDetails = await prisma.revenue.create({
            data: {
                Date: new Date(date),
                Description: income,
                Amount: parseFloat(amount),
            }
        })
        res.status(200).json({ message: "Successfull added" })
    } catch (error) {
        console.log("Processing Error")
        res.status(500).json({ message: "Error occured" })
    }
})



//retrieve
export const retrieveRevenue = asyncHandler(async (req, res) => {
    try {
        const getDetails = await prisma.revenue.findMany();

        res.send({ revenue: getDetails });
    } catch (error) {
        console.log("Processing error", error)
        res.status(500).json({ message: "Processing error" })
    }
})


//update revenue
export const updateRevenue = asyncHandler(async (req, res) => {

    try {

        const { id, date, revenue, amount } = req.body;

        const updateDetails = await prisma.revenue.update({
            where: {
                id: id
            },
            data: {
                Date: new Date(date),
                Description: revenue,
                Amount: parseFloat(amount)
            }
        })
        res.status(200).json({
            message: "Revenue updated successfully",
            updatedRevenue: updateDetails
        });
    } catch (error) {
        console.log("Processing error")
    }
})


//delete revenue
export const deleteRevenue = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {

        const deleteDetails = await prisma.revenue.delete({
            where: {
                id: id
            }
        })
        res.status(200).json({ message: "Successfully deletion" })
    } catch (error) {
        console.log("processing error");
    }
})


export const retreiveTotalRevenue = asyncHandler(async (req, res) => {

    try {

        const monthlyRevenue = await prisma.revenue.findMany();
        const monthlyTotals = {};
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth();

        monthlyRevenue.forEach(revenu => {
            const date = new Date(revenu.Date);
            const monthIndex = date.getMonth();

            if (monthIndex <= currentMonthIndex) {
                const monthName = months[monthIndex];

                if (!monthlyTotals[monthName]) {
                    monthlyTotals[monthName] = 0
                }

                monthlyTotals[monthName] += revenu.Amount;
            }
        });

        const result = months.slice(0, currentMonthIndex + 1)

            .map(mon => {
                const total = monthlyTotals[mon] || 0;
                return { month: mon, revenue: total };
            });

        res.send({ monthlyRevenue: result })
    } catch (error) {
        res.status(500).json({ message: "process occured" })
    }
})