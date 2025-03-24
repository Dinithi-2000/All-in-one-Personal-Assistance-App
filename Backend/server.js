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




//create express application instance
const app = express();

dotenv.config();

//set local host port
const PORT = process.env.PORT || 8070;

app.use(express.json())

//apply middleware to the applicaton and convert JSON request to HTTP request
app.use(cors());
app.use(bodyParser.json());

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

app.use("/home/payment", paymentRoute)
app.use("/home/Refund", RefundRouter)
app.use("/api", PaymentGatewayRoute)
app.use("/home/payment/savedPayment", savedPaymentRouter)
app.use("/adminDashBoard/Financial", financialActivityRoute)

