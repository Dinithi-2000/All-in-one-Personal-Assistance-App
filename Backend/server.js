import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"

// import Routes
import routes from './routes/mainRoutes.js'


//create express application instance
const app = express();

dotenv.config();

app.use(express.json())

//apply middleware to the applicaton and convert JSON request to HTTP request
app.use(cors());
app.use(bodyParser.json());

//get mongodb url
const PORT = process.env.PORT || 5000;

//create connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false,
    socketTimeoutMS: 10000,  
  })
  .then(() => {
    console.log('Connected to database successfully 💰'), app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch(err => {
    console.log(`connection error 💩: ${err}`);
  });
//start server
app.listen(PORT, () => {
    console.log(`server start and running ${PORT}`);
})

app.use('/api',routes);


