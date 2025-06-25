import express from "express";
import AssignmentsController from "../controllers/assignmentsController";
import { authenticate } from "../middlewares/authenticate";

const assignmentsController = new AssignmentsController();

const assignmentsRouter = express.Router();

assignmentsRouter.get("/", assignmentsController.healthCheck);

assignmentsRouter.get(
  "/assignments",
  authenticate,
  assignmentsController.getAssignments
);

assignmentsRouter.post(
  "/assignments/assign",
  authenticate,
  assignmentsController.assignAssignment
);

assignmentsRouter.get(
  "/assignments/status",
  authenticate,
  assignmentsController.getAssignmentStatus
);

assignmentsRouter.put(
  "/assignments/status",
  authenticate,
  assignmentsController.updateAssignmentStatus
);
