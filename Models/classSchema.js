import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    dbstandard: {type: String, required: true},
    dbdivision: {type: String, required: true},
});

const Class = mongoose.model("Class", classSchema);
export default Class;