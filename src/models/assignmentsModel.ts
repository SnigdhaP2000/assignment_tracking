import { stat } from "fs";
import joi from "joi";

export const getAssignmentSchema = joi.object({
  class_id: joi.string().required(),
  division_id: joi.string().required(),
  assignment_id: joi.string().optional(),
  student_id: joi.string().optional(),
});

export const assignAssignmentSchema = joi.object({
  student_id: joi.string().required(),
  assignment_ids: joi.array().items(joi.string()).required(),
});

export const updateAssignmentStatusSchema = joi.object({
  assignment_id: joi.string().required(),
  student_id: joi.string().required(),
  status: joi
    .string()
    .valid("assigned", "learning", "writing notes", "completed")
    .required(),
});

export const getAssignmentStatus = joi.object({
  assignment_id: joi.string().optional(),
  student_id: joi.string().optional(),
  status: joi.string().optional,
  class_id: joi.string().required(),
  division_id: joi.string().required(),
  keyword: joi.string().optional(),
});
