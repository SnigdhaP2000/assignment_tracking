import express, { Request, Response } from "express";
import { errosMessages } from "../util/errorMessages";
import { getAssignmentSchema, getAssignmentStatus, assignAssignmentSchema, updateAssignmentStatusSchema } from "../models/assignmentsModel";
import pool from "../../dbConnect";

export default class AssignmentsService {

  public async healthCheck(req: Request) {
    return { status: "success", message: "checking helath. OK.", data: {} };
  }

  public async getAssignments(req: Request) {
    const { query = {} } = req;
    const { error } = await getAssignmentSchema.validateAsync(query);
    if (error) {
      throw new Error(error.message || errosMessages.invalid_input);
    }
    const { class_id, devision_id } = query;

    const getAssignment = await pool.query(
      `SELECT 
    id, 
    name 
    FROM assignments 
    WHERE class_id = $1 
    AND division_id = $2
    AND is_active = true
    AND is_deleted = false`,
      [class_id, devision_id]
    );
    return getAssignment;
  }

  public async assignAssignment(req: Request) {
    const { body = {} } = req;
    const { student_id, assignment_ids } = body;
    const { error } = await assignAssignmentSchema.validateAsync(body);
    if (error) {
      throw new Error(error.message || errosMessages.invalid_input);
    }

    let assignQuery = `
      INSERT INTO student_assignment_mapping (student_id, assignment_id, status, created_at)
      VALUES
    `;

    const values: any[] = [];

    assignment_ids.forEach((assignmentId: string, index: number) => {
      let baseIndex = index * 4;
      values.push(student_id, assignmentId, "assigned", new Date());
      assignQuery += `($${baseIndex + 1}, $${baseIndex + 2}, $${
        baseIndex + 3
      }, $${baseIndex + 4}),`;
    });

    assignQuery = assignQuery.slice(0, -1);

    assignQuery += `RETURNING *;`;

    try {
      const result = await pool.query(assignQuery, values);
      if (!isNull(result)) return {};
    } catch (error) {
      throw new Error(errosMessages.operation_failed);
    }
  }

  public async updateAssignmentStatus(req: Request) {
    const { body = {} } = req;
    const { student_id, assignment_id, status } = body;
    const { error } = await updateAssignmentStatusSchema.validateAsync(body);
    if (error) {
      throw new Error(error.message || errosMessages.invalid_input);
    }

    const updateQuery = `
      UPDATE student_assignment_mapping 
      SET status = $1, updated_at = $2 
      WHERE student_id = $3 AND assignment_id = $4 
      RETURNING *;
    `;

    const values = [status, new Date(), student_id, assignment_id];

    try {
      const result = await pool.query(updateQuery, values);
      if (!isNull(result)) return {};
    } catch (error) {
      throw new Error(errosMessages.operation_failed);
    }
  }

  public async getAssignmentStatus(req: Request) {
    const { body = {} } = req;
    const { error } = await getAssignmentStatus.validateAsync(body);
    if (error) {
      throw new Error(error.message || errosMessages.invalid_input);
    }
    const {
      class_id,
      devision_id,
      assignment_id,
      student_id,
      status,
      date_range,
      keyword
    } = body;
    let values: any[] = [class_id, devision_id];
    let whereClause: any[] = [`is_active = true`, `is_deleted = false`];
    if (assignment_id) {
      whereClause.push(`a.id = $${values.length + 1}`);
      values.push(assignment_id);
    }
    if (student_id) {
      whereClause.push(`sam.student_id = $${values.length + 1}`);
      values.push(student_id);
    }
    if (status) {
      whereClause.push(`sam.status = $${values.length + 1}`);
      values.push(status);
    }
    if (date_range && date_range.start && date_range.end) {
      whereClause.push(
        `sam.created_at BETWEEN $${values.length + 1} AND $${values.length + 2}`
      );
      values.push(date_range.start, date_range.end);
    }
    if (class_id) {
      whereClause.push(`c.class_id = $${values.length + 1}`);
      values.push(class_id);
    }
    if (devision_id) {
      whereClause.push(`d.division_id = $${values.length + 1}`);
      values.push(devision_id);
    }
    if (keyword) {
      whereClause.push(`a.name ILIKE $${values.length + 1}`);
      values.push(`%${keyword}%`);
    }

    const getAssignment = await pool.query(
      `SELECT 
    a.id, 
    a.name,
    sam.status,
    sam.updated_at as last_updated, 
    FROM assignments a
    JOIN student_assignment_mapping sam ON a.id = sam.assignment_id 
    JOIN students s ON sam.student_id = s.id
    JOIN classes c ON s.class_id = c.id
    JOIN divisions d ON s.division_id = d.id
    WHERE ${whereClause.join(" AND ")}`,
      values
    );
    return getAssignment;
  }
}
