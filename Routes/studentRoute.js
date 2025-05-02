import { Router } from "express";
import Student from "../Models/studentSchema.js";
import Class from "../Models/classSchema.js";

const studentRoute = Router();

studentRoute.post("/createStudent", async (req, res) => {
  try {
    const { name, mobile, classId } = req.body;
    console.log("3", classId);

    const lastStudent = await Student.findOne({ dbclassId: classId }).sort({
      dbrollnum: -1,
    });
    console.log("1", lastStudent);

    const nextRollnum = lastStudent ? lastStudent.dbrollnum + 1 : 1;
    console.log("2", nextRollnum);

    const student = new Student({
      dbname: name,
      dbrollnum: nextRollnum,
      dbmobile: mobile,
      dbclassId: classId,
    });
    await student.save();
    console.log("Student added successfully");
    res.status(201).json("Student added successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

studentRoute.patch("/updateStudent/:id", async (req, res) => {
  try {
    const { newclassId } = req.body;
    const rollnum = req.params.id;

    const studentExist = await Student.findOne({ dbrollnum: rollnum });
    if (studentExist) {
      const result = await Student.updateOne(
        { dbrollnum: rollnum },
        {
          $set: { dbclassId: newclassId },
        }
      );
      if (result.modifiedCount > 0) {
        res
          .status(200)
          .json({ message: "Student's class updated successfully" });
        console.log("Class updated successfully");
      }
    } else {
      res.status(404).json({ message: "Student is not present" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

studentRoute.get("/studentsInClass", async (req, res) => {
  try {
    const { dbstandard, dbdivision } = req.query;
    console.log("1", dbstandard, dbdivision);

    const classExist = await Class.findOne({ dbstandard, dbdivision });
    console.log("2", classExist);

    if (classExist) {
      const studentExist = await Student.find({ dbclassId: classExist._id });
      if (studentExist.length == 0) {
        return res
          .status(404)
          .json({ message: "No students found in this class" });
      }
      res.status(200).json({ studentExist });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

studentRoute.get("/studentInStandard", async (req, res) => {
 
  try {
    const { dbstandard } = req.query;
    const classId = await Class.find({ dbstandard });

    const promises = classId.map(async (element) => {
      const students = await Student.find({ dbclassId: element._id });
      return {
        classId: element._id,
        division: element.dbdivision,
        students,
      };
    });

    const studentsByClass = await Promise.all(promises);
    const formattedOutput = studentsByClass.map((classData) => {
      return {
        division: classData.division,
        students: classData.students.map((student) => ({
          id: student._id,
          name: student.dbname,
          rollNumber: student.dbrollnum,
          mobile: student.dbmobile,
        })),
      };
    });
    console.log("Student list is displayed");
    res.status(200).json({ formattedOutput });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default studentRoute;
