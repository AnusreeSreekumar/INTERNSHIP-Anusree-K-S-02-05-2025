import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  dbname: { type: String, required: true },
  dbrollnum: { type: Number, required: true },
  dbmobile: { type: Number, required: true },
  dbclassId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
});

studentSchema.index({ dbrollnum: 1, dbclassId: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);

export default Student;