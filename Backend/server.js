import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import { Server } from "socket.io"
import http from 'http'
import { paymentRoute } from "./routes/paymentRouts.js"
import { RefundRouter } from "./routes/RefundRoutes.js"
import { savedPaymentRouter } from "./routes/savedPaymentRoute.js"
import { financialActivityRoute } from "./routes/financialActivity.js"
import { PaymentGatewayRoute } from "./routes/PaymentGatewayRoute.js"
import { bookingRouter } from "./routes/bookingRoutes.js";
import ServiceProviderRouter from './routes/serviceProviderRoute.js';

import { schedulePaymentComplete } from "./services/paymentschedule.js"
import { Socket } from "dgram"




//create express application instance
const app = express();

dotenv.config();

//set local host port
const PORT = process.env.PORT || 8070;

//socket io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

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

//listen socket connection
io.on('connection', (socket) => {
    console.log("Conected ID", socket.id)
})
export { io, server };



app.use("/home/payment", paymentRoute)
app.use("/home/Refund", RefundRouter)
app.use("/api", PaymentGatewayRoute)
app.use("/home/payment/savedPayment", savedPaymentRouter)
app.use("/adminDashBoard/Financial", financialActivityRoute)
app.use("/home/booking", bookingRouter);
app.use("/home/serviceProvider", ServiceProviderRouter)

schedulePaymentComplete();
