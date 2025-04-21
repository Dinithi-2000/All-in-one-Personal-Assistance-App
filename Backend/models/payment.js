import asyncHandler from "express-async-handler"
import { prisma } from "../config/prismaConfig.js"
import { ObjectId } from "mongodb";

const PAYHERE_CHECKOUT_URL = 'https://sandbox.payhere.lk/pay/checkout';
//create paymente
const createPayment = asyncHandler(async (req, res) => {
    console.log("Create Payment");
    let { Amount, Currency, PaymentMethod, order_id, BookingId, Item } = req.body;

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


        // Initialize PayHere payment
        const paymentData = {
             merchant_id: process.env.PAYHERE_MERCHANT_ID,
            merchant_secret: process.env.PAYHERE_SECRET_KEY,
            return_url: 'http://your-frontend-url.com/payment-success', // Redirect after payment
            cancel_url: 'http://your-frontend-url.com/payment-cancel', // Redirect if payment is canceled
            notify_url: 'http://localhost:8070/api/payment-notify', // Webhook for payment notifications
            order_id: order_id,
            items: Item,
            amount: Amount,
            currency: Currency,


        };

        // Redirect user to PayHere checkout page
        res.send({
            message: "Your Pending Payment create Successfully",
            payment: payment,
            checkout_url: `${PAYHERE_CHECKOUT_URL}?${new URLSearchParams(paymentData).toString()}`,
        });




    } catch (error) {
        console.error('Error initializing payment:', error);
        res.status(500).json({ error: 'Payment initialization failed' });
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

//retrieve bookindDetails
const retrieveBookingDetails = asyncHandler(async (req, res) => {
    const { providerId, customerId } = req.params;
    const bookingDetails = await prisma.booking.findFirst({
        where: {
            CustomerID: customerId,
            Provider: providerId,
        }
    })
    if (!bookingDetails) {
        return res.status(404).json({ message: "Booking details not found" });
    }
    res.status(200).json(bookingDetails);
})

//retrive ServiceProvider
const retrieveSelectedProvider = asyncHandler(async (req, res) => {

    const { categoryID } = req.params;
    console.log("Category ID:", categoryID);

    try {
        const getServiceIDS = await prisma.service.findMany({
            where: {
                Category: new ObjectId(categoryID),
            },
            select: {
                ServiceID: true,
            }

        })
        console.log("Service IDs found:", getServiceIDS);

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




//set provider salary
const makeProviderSalary = asyncHandler(async (req, res) => {
    try {
        //retirev payments.
        const completePayment = await prisma.payment.findMany({
            where: {
                Status: "COMPLETED",
            },
            include: {
                booking: {
                    include: {
                        serviceProvider: true,
                    },
                },
            },
        })


        //retirev EPF ETF rate
        const rate = await prisma.deductionRate.findMany();
        const epfAmpount = rate.find(r => r.type === "EPF")?.rate || 0;
        const etfAmount = rate.find(r => r.type === "ETF")?.rate || 0;

        //group paymnet by provider
        const providerSalaries = {};

        completePayment.forEach(payment => {
            const providerId = payment.booking.serviceProvider.providerId;
            const amount = payment.Amount;

            if (!providerSalaries[providerId]) {
                providerSalaries[providerId] = {
                    totalEarning: 0,
                    commission: 0,
                    epfDeduct: 0,
                    etfDeduct: 0,
                    netSalary: 0,
                };
            }
            providerSalaries[providerId].totalEarning += amount;


        });

        //calculate net salary
        for (const providerId in providerSalaries) {
            const totalEarning = providerSalaries[providerId].totalEarning;
            const commisionRate = 0.1;
            const commission = totalEarning * commisionRate;
            const epf = ((totalEarning - commission) * epfAmpount);
            const etf = ((totalEarning - commission) * etfAmount);
            const netSalary = totalEarning - commission - epf - etf;

            //update salary
            providerSalaries[providerId].commission = commission;
            providerSalaries[providerId].EPF = epf;
            providerSalaries[providerId].ETF = etf;
            providerSalaries[providerId].netSalary = netSalary;

            //update system revenue
            await prisma.revenue.create({
                data: {
                    Description: `Commission from provide ${providerId}`,
                    Amount: commission,
                }
            })

            //update provider salary 
            await prisma.providerSalary.upsert({
                where: { provider: providerId },
                update: {
                    EPF: { increment: epf },
                    ETF: { increment: etf },
                    totSalary: { increment: netSalary },
                }, create: {
                    provider: providerId,
                    EPF: epf,
                    ETF: etf,
                    totSalary: netSalary,
                },
            });
            //
            const provider = await prisma.serviceProvider.findUnique({
                where: {
                    ProviderID: providerId
                },
            });
            const pdfBytes = await generatePaysheetPDF(provider, providerSalaries[providerId]);
            //send pdf to provider's mail
            await sendEmailWithPaysheet(provider, pdfBytes);
        }
        res.json({
            message: "Provider salaries calculated and updated successfully",
            providerSalaries,
        });
    } catch (error) {
        console.error("Error calculating provider salaries:", error);
        res.status(500).json({
            message: "Error calculating provider salaries",
            error: error.message,
        });
    }
})
export { createPayment, retrievAllPayments, filterPaymentHistory, retriveServiceCategory, retrieveSelectedProvider, makeProviderSalary, retrieveBookingDetails };
