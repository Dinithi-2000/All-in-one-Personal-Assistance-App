import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import { paymentRoute } from "./routes/paymentRouts.js"
import { RefundRouter } from "./routes/RefundRoutes.js"
import { savedPaymentRouter } from "./routes/savedPaymentRoute.js"
import { financialActivityRoute } from "./routes/financialActivity.js"
import { PaymentGatewayRoute } from "./routes/PaymentGatewayRoute.js"
import { bookingRouter } from "./routes/bookingRoutes.js";
import ServiceProviderRouter from './routes/serviceProviderRoute.js';
import { schedulePaymentComplete } from "./services/paymentschedule.js"
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatBotRoutes from './routes/chatBotRoutes.js';
import spRoutes from './routes/spRoutes.js';
import adminRoutes from './routes/adminRoutes.js'

//import middlewares
import validateToken from "./middlwares/validateTokenHandler.js"


//create express application instance
const app = express();

dotenv.config();

//set local host port
const PORT = process.env.PORT || 8070;

app.use(express.json({ limit: '50mb' }));  // Increase JSON payload limit
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // Increase URL-encoded payload limit

//apply middleware to the applicaton and convert JSON request to HTTP request
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '50mb' }));  // Increase bodyParser limit too
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


//get mongodb url
const URL = process.env.MONGO_URL;

//create connection
mongoose.connect(URL)
    .then(() => console.log("MongoDb Connected Successfully"))
    .catch((err) => console.log("Connection Failed", err));

//open created connection
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MogoDB success")
})

//start server
app.listen(PORT, () => {
    console.log(`server start and running ${PORT}`);
})


app.use('/api/auth',authRoutes);
app.use('/api/user',validateToken,userRoutes)
app.use('/api/service-provider',validateToken,spRoutes)
app.use("/home/payment", paymentRoute)
app.use("/home/Refund", RefundRouter)
app.use("/api", PaymentGatewayRoute)
app.use("/home/payment/savedPayment", savedPaymentRouter)
app.use("/adminDashBoard/Financial", financialActivityRoute)
app.use("/home/booking", bookingRouter);
app.use("/home/serviceProvider", ServiceProviderRouter)
app.use("/admin", adminRoutes)
app.use('/api/chat/',chatBotRoutes);

schedulePaymentComplete();
