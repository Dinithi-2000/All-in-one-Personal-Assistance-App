import asyncHandler from "express-async-handler"
import { prisma } from "../config/prismaConfig.js"
import { ObjectId } from "mongodb";
import Stripe from "stripe";
import { salaryMail } from "../services/salaryMail.js";


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

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.CLIENT_SITE_URL}payment/paymentSuccess`,
            cancel_url: `${process.env.CLIENT_SITE_URL}payment/paymentCancel`,
            customer_email: 'sdinithi7@gmail.com',
            client_reference_id: BookingId,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: Amount * 100,
                        product_data: {
                            name: 'Booking Payment'
                        },

                    },
                    quantity: 1,
                },
            ],

        })


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
        res.status(200).json({ message: 'Successfully Paid', session })

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
        const completePayments = await prisma.payment.findMany({
            where: { Status: "COMPLETED" },
            include: {
                booking: {
                    include: {
                        serviceProvider: {
                            include: {
                                service: {  // Include service to get commission rate
                                    select: { CommisionRate: true }
                                }
                            }
                        }
                    }
                }
            }
        });


        //retirev EPF ETF rate
        const rate = await prisma.deductionRate.findMany();
        console.log(rate)
        const epfAmpount = rate.find(r => r.type === "EPF")?.rate || 0;
        const etfAmount = rate.find(r => r.type === "ETF")?.rate || 0;
        console.log(epfAmpount);



        //group paymnet by provider
        const providerSalaries = {};

        completePayments.forEach(payment => {
            const providerId = payment.booking.serviceProvider.ProviderID;
            const amount = payment.Amount;
            const commissionRate = payment.booking?.serviceProvider?.service?.CommisionRate;
            const finalCommissionRate = commissionRate !== undefined ? (commissionRate / 100) : 0.1; // Dividing by 100 if stored as percentage



            if (!providerSalaries[providerId]) {
                providerSalaries[providerId] = {
                    totalEarning: 0,
                    commissionRate: finalCommissionRate,
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
            const commisionRate = providerSalaries[providerId].commissionRate;
            console.log(commisionRate);
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
            /* const pdfBytes = await generatePaySheetPDF(provider, providerSalaries[providerId]);
             //send pdf to provider's mail*/
            await salaryMail(provider.email, providerSalaries[providerId])

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
