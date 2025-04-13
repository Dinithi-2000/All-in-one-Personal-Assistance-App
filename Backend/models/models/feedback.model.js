import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    petId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        trim: true
    },
   
    name : {
        type: String,
        required: true,
        trim: true
    },
    u_email:{
        type: String,
        required: true,
        trim: true
    },
    category : {
        type: String,
        required: true,
        trim: true
    },
    reviews : {
        type: String,
        required: true,
        trim: true
    },
   
   
    selectraiting: {
        type: String||null,
      
        trim: true
    },
   
   
  
  
}, { timestamps: true });

const Raiting = mongoose.model("Feedback", itemSchema);

export default Raiting;
