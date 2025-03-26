// Backend/config/models/booking.js
import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js"

// Filter service providers based on query parameters
const filterServiceProviders = asyncHandler(async (req, res) => {
  try {
    const {
      minHourlyRate,
      maxHourlyRate,
      servicesOffered,
      languagesSpoken,
      categoryType,
    } = req.query;

    // Build the filter query
    const filters = {};

    // Filter by category type (e.g., Pet Care, Tutoring)
    if (categoryType) {
      filters.service = {
        category: {
          Type: categoryType,
        },
      };
    }

    // Filter by services offered (e.g., WALKING, DAY CARE for Pet Care)
    if (servicesOffered) {
      const servicesArray = servicesOffered.split(",");
      filters.service = {
        ...filters.service,
        ServiceName: {
          in: servicesArray,
        },
      };
    }

    // Filter by languages spoken (e.g., SINHALA, ENGLISH, TAMIL)
    if (languagesSpoken) {
      const languagesArray = languagesSpoken.split(",");
      filters.languagesSpoken = {
        some: {
          language: {
            in: languagesArray,
          },
        },
      };
    }

    // Filter by hourly rate
    if (minHourlyRate || maxHourlyRate) {
      filters.hourlyRate = {};
      if (minHourlyRate) {
        filters.hourlyRate.gte = parseFloat(minHourlyRate);
      }
      if (maxHourlyRate) {
        filters.hourlyRate.lte = parseFloat(maxHourlyRate);
      }
    }

    // Query the database
    const serviceProviders = await prisma.serviceProvider.findMany({
      where: filters,
      include: {
        service: {
          include: {
            category: true,
          },
        },
        languagesSpoken: true,
      },
    });

    res.status(200).json({
      message: "Service providers filtered successfully",
      serviceProviders,
    });
  } catch (error) {
    console.error("Error filtering service providers:", error);
    res.status(500).json({
      message: "Error filtering service providers",
      error: error.message,
    });
  }
});

// Create a new booking
const createBooking = asyncHandler(async (req, res) => {
  try {
    const {
      customerID,
      providerID,
      agreementDuration,
      bookingService,
      monthlyPayment,
    } = req.body;

    if (!customerID || !providerID || !bookingService) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = await prisma.booking.create({
      data: {
        AgreementDuration: agreementDuration,
        Booking_Service: bookingService,
        MonthlyPayment: parseFloat(monthlyPayment),
        Status: "PENDING",
        customer: {
          connect: { id: customerID },
        },
        serviceProvider: {
          connect: { ProviderID: providerID },
        },
      },
      include: {
        customer: true,
        serviceProvider: true,
      },
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      message: "Error creating booking",
      error: error.message,
    });
  }
});

// Retrieve all bookings for a customer
const retrieveBookings = asyncHandler(async (req, res) => {
  try {
    const { customerID } = req.params;

    const bookings = await prisma.booking.findMany({
      where: {
        CustomerID: customerID,
      },
      include: {
        customer: true,
        serviceProvider: {
          include: {
            service: {
              include: {
                category: true,
              },
            },
          },
        },
        payment: true,
      },
      orderBy: {
        BookingDate: "desc",
      },
    });

    res.status(200).json({
      message: "Bookings retrieved successfully",
      bookings,
    });
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res.status(500).json({
      message: "Error retrieving bookings",
      error: error.message,
    });
  }
});

// Update a booking
const updateBooking = asyncHandler(async (req, res) => {
  try {
    const { bookingID } = req.params;
    const { agreementDuration, bookingService, monthlyPayment, status } =
      req.body;

    const updatedBooking = await prisma.booking.update({
      where: {
        BookingID: bookingID,
      },
      data: {
        AgreementDuration: agreementDuration,
        Booking_Service: bookingService,
        MonthlyPayment: parseFloat(monthlyPayment),
        Status: status,
      },
      include: {
        customer: true,
        serviceProvider: true,
      },
    });

    res.status(200).json({
      message: "Booking updated successfully",
      updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({
      message: "Error updating booking",
      error: error.message,
    });
  }
});

// Delete a booking
const deleteBooking = asyncHandler(async (req, res) => {
  try {
    const { bookingID } = req.params;

    await prisma.booking.delete({
      where: {
        BookingID: bookingID,
      },
    });

    res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({
      message: "Error deleting booking",
      error: error.message,
    });
  }
});

export {
  filterServiceProviders,
  createBooking,
  retrieveBookings,
  updateBooking,
  deleteBooking,
};