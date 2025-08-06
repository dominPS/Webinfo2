import { z } from 'zod';

// Vacation Info schema - represents vacation limit information
export const VacancyInfoSchema = z.object({
  Code: z.string().optional(),
  Name: z.string().optional(),
  Parent: z.string().nullable().optional(),
  Used: z.number().optional(),
  Limit: z.number().optional(),
  Left: z.number().optional(),
  YearDays: z.number().optional(),
  PrevDays: z.number().optional(),
});

// Vacation schema - represents individual vacation record
export const VacancySchema = z.object({
  ID: z.number().optional(),
  DateFrom: z.string().optional(), // Date as ISO string
  DateTo: z.string().optional(), // Date as ISO string
  Days: z.number().optional(),
  VacTimeView: z.union([z.string(), z.number()]).optional(), // Can be string or number from API
  AbsenceName: z.string().optional(),
  AbsenceCode: z.string().optional(), // Alternative field name
  Code: z.string().optional(), // Alternative field name
  Name: z.string().optional(), // Alternative field name
  Description: z.string().optional(), // Alternative field name
  Comment: z.string().nullable().optional(),
  Reason: z.string().optional(), // Additional field for description
  Note: z.string().optional(), // Additional field for description
  Details: z.string().optional(), // Additional field for description
  Status: z.union([z.string(), z.number()]).optional(), // Can be string or number
}).passthrough(); // Allow additional fields from API

// Range schema for vacation plans
export const RangeSchema = z.object({
  ID: z.number().optional(),
  From: z.string().optional(), // Date as ISO string
  To: z.string().optional(), // Date as ISO string
  Days: z.number().optional(),
  Status: z.union([z.string(), z.number()]).optional(), // Can be string or number from API
});

// Vacation Plan schema
export const VacancyPlanSchema = z.object({
  Year: z.number(),
  Comment: z.string().nullable().optional(),
  Plans: z.array(RangeSchema),
});

// Vacation History schema
export const VacancyHistorySchema = z.object({
  Vacancies: z.array(VacancySchema),
});

// Main VacationModel schema
export const VacationModelSchema = z.object({
  VacancyInfo: z.array(VacancyInfoSchema).nullable().optional(),
  VacancyPlan: VacancyPlanSchema.nullable().optional(),
  VacancyPlanNext: VacancyPlanSchema.nullable().optional(),
  VacancyHistory: VacancyHistorySchema,
  VacanciesRevoked: z.array(VacancySchema),
});

// TypeScript types
export type VacancyInfo = z.infer<typeof VacancyInfoSchema>;
export type Vacancy = z.infer<typeof VacancySchema>;
export type Range = z.infer<typeof RangeSchema>;
export type VacancyPlan = z.infer<typeof VacancyPlanSchema>;
export type VacancyHistory = z.infer<typeof VacancyHistorySchema>;
export type VacationModel = z.infer<typeof VacationModelSchema>;
