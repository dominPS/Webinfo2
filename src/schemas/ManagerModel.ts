import { z } from 'zod';

export const ManagerModelSchema = z.object({
    ManageList: z.array(z.object({
        Id_managed: z.number(),
        Name: z.string(),
        Type: z.number(), // ManageEnum
    })).nullable().default([]),
    ToManageList: z.array(z.object({
        IdKierownika: z.number(),
        Id_managed: z.number(),
        Name: z.string(),
        From: z.string().transform(val => new Date(val)).nullable().optional(),
        To: z.string().transform(val => new Date(val)).nullable().optional(),
        Enabled: z.boolean(),
    })).nullable().default([]),
    WorkGroupList: z.array(z.object({
        IdManager: z.number().optional(),
        FullNameManager: z.string().optional(),
        Name: z.string().optional(),
        ID: z.number().optional(),
        FullName: z.string().optional(),
    })).nullable().default([]),
    TempDeputyEnabled: z.boolean().optional().default(false),
    DeputyEnabledFrom: z.string().transform(val => new Date(val)).optional(),
    DeputyEnabledTo: z.string().transform(val => new Date(val)).optional(),
    DeputeWorkGroupId: z.number().nullable().optional(),
    TempDeputyName: z.string().nullable().default(''),
    Message: z.string().nullable().default(''),
    TempMessage: z.string().nullable().default(''),
});

export type ManagerModel = z.infer<typeof ManagerModelSchema>;