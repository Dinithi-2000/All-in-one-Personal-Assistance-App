import asyncHandler from "express-async-handler"
import { prisma } from "../config/prismaConfig.js"


//create paymente
const createPayment = asyncHandler(async (req, res) => {
    console.log("Create Payment");
    let { Amount, PaymentMethod, BookingId } = req.body;

    if (!Amount || !PaymentMethod || !BookingId) {
        res.status(400);
        throw new Error("Missing Required fields");
    }
    try {
        //find reletated paymentMethod detials
        let paymentMethod = await prisma.paymentMethod.findFirst({
            where: { PaymentType: PaymentMethod },
        });

        if (!paymentMethod) {
            paymentMethod = await prisma.paymentMethod.create({
                data: {
                    PaymentType: PaymentMethod,
                    Description: "new Payment Method"
                },
            });
        }

        //check Booking ID
        const bookingExists = await prisma.booking.findUnique({
            where: { BookingID: BookingId }
        });
        if (!bookingExists) {
            res.status(400);
            throw new Error("Invalid Booking ID");
        }


        //create payment
        const payment = await prisma.payment.create({

            data: {
                Amount: parseFloat(Amount),
                paymentMethod: {
                    connect: {
                        MethodId: paymentMethod.MethodId
                    },
                },
                booking: {
                    connect: {
                        BookingID: BookingId
                    },
                }
            }


        });
        const monthlyPayment = parseFloat(bookingExists.MonthlyPayment);

        res.send({
            message: "Payment create Successfully",
            payment: payment,
        });



    } catch (error) {
        res.status(500).json({ message: "payment failed" });
        throw new Error("Error creating Payment" + error.message);
    }

})

//retriew all payments
const retrievAllPayments = asyncHandler(async (req, res) => {
    try {
        const allPayment = await prisma.payment.findMany({
            orderBy: {
                PaymentDate: "desc"
            },
            include: {
                paymentMethod: true,
                booking: {
                    include: {
                        //add customer and booking details related to the booking
                        customer: true,
                        serviceProvider: true,

                    }
                }
            }
        });
        //Map payment with details
        const paymentDetails = allPayment.map(payment => ({
            ...payment,
            paymentMethodName: payment.paymentMethod.PaymentType,
            bookingDetails: {
                bookingID: payment.booking.BookingID,
                agreemetnDuration: payment.booking.AgreementDuration,
                monthlyPayment: payment.booking.MonthlyPayment,
                bookingDate: payment.booking.BookingDate,
                customerName: payment.booking.customer ?
                    `${payment.booking.customer.FirstName}${payment.booking.customer.LastName}`
                    : "unknown",
                providerName: payment.booking.serviceProvider ?
                    `${payment.booking.serviceProvider.FirstName}${payment.booking.serviceProvider.LastName}` :
                    "unknown Provider"


            }
        }))

        res.send({ payment: paymentDetails });
    } catch (error) {
        console.error("Error retrieving payment:", error);
        res.status(500).json({ message: "Error Retrieving payment", error: error.message })
    }


});


//payment details filter from given time range
const filterPaymentHistory = asyncHandler(async (req, res) => {
    try {
        //get user entered stard &end date
        const { startDate, endDate } = req.query;

        //create object to store filtered date
        let dateFilter = {};
        if (startDate) {
            //filter date after or on start date
            dateFilter.gte = new Date(startDate);
        }
        if (endDate) {
            //filter date before or on end date
            dateFilter.lte = new Date(endDate);
        }

        //for testing
        console.log("Date Filter:", dateFilter);

        const allfilteredPAyment = await prisma.payment.findMany({
            where: {
                PaymentDate: Object.keys(dateFilter).length > 0 ? dateFilter : undefined
            },
            orderBy: {
                PaymentDate: "desc"
            },
            include: {
                paymentMethod: true,
                booking: {
                    include: {
                        //add customer and booking details related to the booking
                        customer: true,
                        serviceProvider: true,

                    }
                }
            }

        });
        //Map payment with details
        const paymentDetails = allfilteredPAyment.map(payment => ({
            ...payment,
            paymentMethodName: payment.paymentMethod.PaymentType,
            bookingDetails: {
                bookingID: payment.booking.BookingID,
                agreemetnDuration: payment.booking.AgreementDuration,
                monthlyPayment: payment.booking.MonthlyPayment,
                bookingDate: payment.booking.BookingDate,
                customerName: payment.booking.customer ?
                    `${payment.booking.customer.FirstName}${payment.booking.customer.LastName}`
                    : "unknown",
                providerName: payment.booking.serviceProvider ?
                    `${payment.booking.serviceProvider.FirstName}${payment.booking.serviceProvider.LastName}` :
                    "unknown Provider"


            }
        }))

        //res.send({ payment: paymentDetails });
        res.json(paymentDetails);
    } catch (error) {
        console.error("Error retrieving payment:", error);
        res.status(500).json({ message: "Error Retrieving payment", error: error.message })
    }
})

//retriev service Category
const retriveServiceCategory = asyncHandler(async (req, res) => {

    const getCategory = await prisma.category.findMany();
    res.json(getCategory);
})

//retrive ServiceProvider
const retrieveSelectedProvider = asyncHandler(async (req, res) => {
    const { categoryID } = req.params

    try {
        const getServiceIDS = await prisma.service.findMany({
            where: {
                Category: categoryID
            },
            select: {
                ServiceID: true
            }

        })

        const serviceIDS = getServiceIDS.map((services) => services.ServiceID);

        const getProviderName = await prisma.serviceProvider.findMany({
            where: {
                ServiceType: {
                    in: serviceIDS
                }
            }

        });
        res.json(getProviderName);
    } catch (error) {
        console.error("Error retrieving service providers:", error);
        res.status(500).json({ message: "Error retrieving service providers", error: error.message });
    }


})

export { createPayment, retrievAllPayments, filterPaymentHistory, retriveServiceCategory, retrieveSelectedProvider };