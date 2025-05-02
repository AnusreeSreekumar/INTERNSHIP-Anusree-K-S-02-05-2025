import { Router } from "express";
import Class from "../Models/classSchema.js";
import Student from "../Models/studentSchema.js";

const classRoute = Router();

classRoute.post("/createClass", async (req, res) => {
  const { standard, division } = req.body;
  try {
    const classData = new Class({
      dbstandard : standard,
      dbdivision : division,
    });
    await classData.save();
    res.status(201).json({ message: "Class added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

classRoute.get("/getClassdetails", async (req, res) => {
  try {
    const classDetails = await Class.find();
    if (classDetails) {
      res.status(200).json({ classDetails });
      console.log("All contents are populated");
    } else {
      res.status(404).json({ message: "No data found" });
      console.log("Empty table");
    }
  } catch (error) {
    res.status(500).json({ message: "Unable to query DB" });
  }
});

classRoute.delete("/deleteClass/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    console.log("1", classId);

    const classExist = await Class.findOne({ _id: classId });
    console.log("2", classExist);

    if (classExist) {
      const studentExist = await Student.findOne({ classId: classId });
      console.log("3", studentExist);
      if (studentExist) {
        res.status(400).json({message: "Unable to delete this Class as Students are mapped to it"});
      } 
      else {
        await Class.deleteOne({ _id: classId });
        res.status(200).json({ message: "Class Deleted Successfully" });
        console.log("Class Deleted");
      }
    } 
    else {
      res.status(404).json({ message: "ClassId not found" });
      console.log("No such Class found in DB");
    }
  } catch (err) {
    res.status(500).json({ message: "Unable to perform delete" });
  }
});

export default classRoute;
