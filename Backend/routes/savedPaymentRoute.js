import express from 'express'
import { savedPaymentMethod, deleteSavedOption, retrieveSaveDetails } from "../models/savedPayment.js"

const router = express.Router();

router.post("/Option", savedPaymentMethod);

//delete saved option
router.delete("/deleteOption", deleteSavedOption);

//retrieve detail
router.get("/getOption", retrieveSaveDetails)

export { router as savedPaymentRouter }