import asyncHandler from "express-async-handler"
import { prisma } from "../../config/prismaConfig.js";



export const totalBooking = asyncHandler(async (req, res) => {
    try {
        const totalBookings = await prisma.booking.count();

        res.status(200).json({
            success: true,
            count: totalBookings
        });

    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching total bookings",
            error: error.message
        });
    }
});
export const totatlUsers = asyncHandler(async (req, res) => {
    try {
        const totaUsers = await prisma.customer.count();
        res.status(200).json({
            success: true,
            count: totaUsers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching total bookings",
            error: error.message
        });
    }
})

export const totalServices = asyncHandler(async (req, res) => {
    try {
        const totservice = await prisma.service.count();
        res.status(200).json({
            success: true,
            count: totservice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching total bookings",
            error: error.message
        });
    }
})

export const totaProviders = asyncHandler(async (req, res) => {

    try {
        const totProviders = await prisma.serviceProvider.count();
        res.status(200).json({
            success: true,
            count: totProviders

        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching total bookings",
            error: error.message
        });
    }
})

