import asyncHandler from "express-async-handler"
import { prisma } from "../../config/prismaConfig.js";



export const getSalaryDetails = asyncHandler(async (req, res) => {
    const getDetails = await prisma.providerSalary.findMany({
        include: {
            serviceProvider: {
                select: {
                    FirstName: true,
                    LastName: true
                }
            }
        }
    })

    res.send({ salary: getDetails })
})

export const getDeduction = asyncHandler(async (req, res) => {
    const getratelist = await prisma.deductionRate.findMany();

    res.send({ list: getratelist })
})

export const TopEmployee = asyncHandler(async (req, res) => {
    try {

        const TopEmployee = await prisma.providerSalary.findMany({
            orderBy: {
                totSalary: 'desc',
            },
            take: 5,
            include: {
                serviceProvider: true,
            },
        });
        res.send({ topemployee: TopEmployee })

    } catch (error) {
        console.log("Processing Error")
    }
})

export const updteRate = asyncHandler(async (req, res) => {
    try {
        const { id, type, rate } = req.body;

        const updateDetails = await prisma.deductionRate.update({
            where: {
                id: id
            },
            data: {
                type: type,
                rate: parseFloat(rate)
            }
        })
        res.status(200).json({
            message: "Deduction Rate Updated",
            updateRate: updateDetails
        })
    } catch (error) {
        console.log("Processing Error")
    }
})

