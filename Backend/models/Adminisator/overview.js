import asyncHandler from "express-async-handler"
import { prisma } from "../../config/prismaConfig.js";
import ServiceProvider from "../ServiceProvider.js";
import { startOfMonth, endOfMonth } from "date-fns";
import UserModel from "../UserModel.js";



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
        const totaUsers = await UserModel.countDocuments({});
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

// Adjust path if needed

export const totaProviders = async (req, res) => {
    try {
        const totProviders = await ServiceProvider.countDocuments();
        res.status(200).json({
            success: true,
            count: totProviders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching total providers",
            error: error.message,
        });
    }
};

export const categoryDetails = asyncHandler(async (req, res) => {

    const categoriesWithServices = await prisma.category.findMany({
        include: {
            service: true,
        },
    });

    const result = categoriesWithServices.map(category => ({

        name: category.Type,
        value: category.service.length,
    }));
    res.send({ category: result })
})


export const serviceProviderCountPerCategory = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                service: {
                    include: {
                        serviceProvider: true, // corrected field name
                    },
                },
            },
        });

        const result = categories.map((category) => {
            const providerIds = new Set();

            category.service.forEach((service) => {
                service.serviceProvider.forEach((provider) => {
                    providerIds.add(provider.ProviderID); // use the correct ID field
                });
            });

            return {
                name: category.Type,
                value: providerIds.size,
            };
        });

        res.status(200).json({ data: result });
    } catch (err) {
        console.error("Error fetching provider count:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const completedBookingsPerMonth = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-indexed (Jan = 0)

        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const chartData = [];

        for (let i = 0; i <= currentMonth; i++) {
            const start = startOfMonth(new Date(currentYear, i, 1));
            const end = endOfMonth(start);

            const completedBookingCount = await prisma.booking.count({
                where: {
                    BookingDate: {
                        gte: start,
                        lte: end,
                    },
                    Status: "COMPLETED",
                },
            });

            chartData.push({
                month: monthNames[i], // e.g., "Mar"
                bookings: completedBookingCount, // Number of bookings
            });
        }

        res.status(200).json({ data: chartData });
    } catch (error) {
        console.error("Error fetching completed bookings per month:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};