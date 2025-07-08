import { Hono } from 'hono';
import { Validator } from 'express-validator';

const validateWorkspace = [
  Validator.body('name').notEmpty().withMessage('Workspace name is required'),
];

const validateBoard = [
  Validator.body('title').notEmpty().withMessage('Board title is required'),
  Validator.body('workspaceId').isInt().withMessage('Workspace ID must be an integer'),
];

const validateTask = [
  Validator.body('title').notEmpty().withMessage('Task title is required'),
  Validator.body('boardId').isInt().withMessage('Board ID must be an integer'),
];

const validateChecklist = [
  Validator.body('title').notEmpty().withMessage('Checklist title is required'),
  Validator.body('taskId').isInt().withMessage('Task ID must be an integer'),
];

const validateChecklistItem = [
  Validator.body('title').notEmpty().withMessage('Checklist item title is required'),
  Validator.body('checklistId').isInt().withMessage('Checklist ID must be an integer'),
];

export {
  validateWorkspace,
  validateBoard,
  validateTask,
  validateChecklist,
  validateChecklistItem,
};