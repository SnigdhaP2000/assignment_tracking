import AssignmentsService from "../services/assignmentsService";
import { Request, Response } from "express";
const assignmentsService = new AssignmentsService();

export default class AssignmentsController {
  private assignmentsService: AssignmentsService;

  constructor() {
    this.assignmentsService = assignmentsService;
  }

  public healthCheck = async (req: Request, res: Response) => {
    try {
      const result = await this.assignmentsService.healthCheck(req);
      res
        .status(200)
        .json({ status: "success", message: "checking helath. OK.", data: {} });
    } catch (error) {
      console.error("Error in healthCheck:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  public getAssignments = async (req: Request, res: Response) => {
    try {
      const result = await this.assignmentsService.getAssignments(req);
      res.status(200).json({
        status: "success",
        message: "Assignment fetched successfully",
        data: result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  };

  public async assignAssignment(req: Request, res: Response) {
    try {
      const result = await this.assignmentsService.assignAssignment(req);
      res.status(200).json({
        status: "success",
        message: "Assignment assigened successfully",
        data: result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  }

  public async getAssignmentStatus(req: Request, res: Response) {
    try {
      const result = await this.assignmentsService.getAssignmentStatus(req);
      res.status(200).json({
        status: "success",
        message: "Assignment Status fetched successfully",
        data: result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  }

  public async updateAssignmentStatus(req: Request, res: Response) {
    try {
      const result = await this.assignmentsService.updateAssignmentStatus(req);
      res.status(200).json({
        status: "success",
        message: "Assignment status updated successfully",
        data: result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res.status(400).json({ error: errorMessage });
    }
  }
}
