import asyncHandler from "express-async-handler"
import { prisma } from "../../config/prismaConfig.js"

//Add expenses
export const addExpenses = asyncHandler(async (req, res) => {

    const { date, expense, amount } = req.body;
    try {
        const addDetails = await prisma.expenses.create({
            data: {
                Date: new Date(date),
                Expense: expense,
                Amount: parseFloat(amount),
            }

        })
        res.status(200).json({ message: "Successfully added.", addDetails });
    } catch (error) {
        console.error("prossesing Error");
        res.status(500).json({ message: "Error occured when processing expenses." });
    }
})

//update expenses
export const updateExpense = asyncHandler(async (req, res) => {
    try {
        const { id, date, expence, amount } = req.body;
        console.log(req.body);

        const updateDetail = await prisma.expenses.update({
            where: {
                id: id
            },
            data: {
                Date: new Date(date),
                Expense: expence,
                Amount: parseFloat(amount),
            }
        })
    } catch (error) {
        console.log("Processing error");
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

export const retrieveTotatlExpense = asyncHandler(async (req, res) => {

    try {

        const monthlyExpense = await prisma.expenses.findMany();

        const monthlyTotls = {};

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        //retrieve current data
        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth();

        monthlyExpense.forEach(expenses => {
            const date = new Date(expenses.Date);
            console.log(date);
            const monthIndex = date.getMonth();

            if (monthIndex <= currentMonthIndex) {
                const monthName = months[monthIndex];

                if (!monthlyTotls[monthName]) {
                    monthlyTotls[monthName] = 0;
                }

                monthlyTotls[monthName] += expenses.Amount;
            }
        });

        const result = months.slice(0, currentMonthIndex + 1)
            .map(mon => {
                const total = monthlyTotls[mon] || 0;
                return { month: mon, expense: total };
            });


        res.send({ monthlyExpense: result });


    } catch (error) {
        res.status(500).json({ message: "Retrieve monthly expenses error" });
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


//create profit/lost
export const addProfitLoss = asyncHandler(async (req, res) => {
    try {
        const getRevenue = await prisma.revenue.findMany();
        const getExpenses = await prisma.expenses.findMany();

        console.log(getExpenses);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const getAllMonthsUpToCurrent = (startYear, endYear, endMonth) => {
            const months = [];
            for (let year = startYear; year <= endYear; year++) {
                const maxMonth = year === endYear ? endMonth : 12;
                for (let month = 1; month <= maxMonth; month++) {
                    months.push(`${year}-${month.toString().padStart(2, "0")}`);
                }
            }
            return months;
        };

        const getYearRange = (transactions) => {
            let minYear = Infinity, maxYear = -Infinity;
            transactions.forEach(({ date }) => {
                const year = new Date(date).getFullYear();
                if (year < minYear) minYear = year;
                if (year > maxYear) maxYear = year;
            });
            return { minYear, maxYear };
        };

        const { minYear, maxYear } = getYearRange([...getRevenue, ...getExpenses]);
        const allMonths = getAllMonthsUpToCurrent(minYear, maxYear, currentMonth);

        const revenueByMonth = {}, expensesByMonth = {};

        allMonths.forEach(month => {
            revenueByMonth[month] = 0;
            expensesByMonth[month] = 0;
        });

        getRevenue.forEach(({ date, amount }) => {
            const d = new Date(date);
            if (isNaN(d.getTime())) return;
            const year = d.getFullYear(), month = d.getMonth() + 1;
            if (year > currentYear || (year === currentYear && month > currentMonth)) return;
            const key = `${year}-${month.toString().padStart(2, "0")}`;
            if (revenueByMonth[key] !== undefined) revenueByMonth[key] += amount;
        });

        getExpenses.forEach(({ date, amount }) => {
            const d = new Date(date);
            if (isNaN(d.getTime())) return;
            const year = d.getFullYear(), month = d.getMonth() + 1;
            if (year > currentYear || (year === currentYear && month > currentMonth)) return;
            const key = `${year}-${month.toString().padStart(2, "0")}`;
            if (expensesByMonth[key] !== undefined) expensesByMonth[key] += amount;
        });

        const profitLossByMonth = {};

        allMonths.forEach(month => {
            const totalRevenue = revenueByMonth[month] || 0;
            const totalExpense = expensesByMonth[month] || 0;
            const netAmount = totalRevenue - totalExpense;

            profitLossByMonth[month] = { totalRevenue, totalExpense, netAmount };
        });

        for (const month of Object.keys(profitLossByMonth)) {
            const { totalRevenue, totalExpense, netAmount } = profitLossByMonth[month];

            await prisma.profitLoss.upsert({
                where: { month },
                update: { totalRevenue, totalExpense, netAmount },
                create: { month, totalRevenue, totalExpense, netAmount },
            });
        }

        res.status(201).json({
            success: true,
            message: "Profit/Loss calculated and saved successfully up to the current month",
            data: profitLossByMonth,
        });
    } catch (error) {
        console.error("Processing error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
