import { z } from 'zod';
import { RegistrationTupleSchema } from './common/RegistrationTuple';
import { WorkerScheduleExtSchema } from './common/WorkerScheduleExt';
import { Settlement2Schema } from './common/Settlement2';
import { VacancyRequestSchema } from './common/VacancyRequest';
import { OrderSchema } from './activity/Order';
import { DetailSchema } from './activity/Detail';
import { ActivitySchema } from './activity/Activity';
import { ActivityProgressSchema } from './activity/ActivityProgress';
import { BuldOrderSchema } from './activity/BuldOrder';

export const WorkerRegModelSchema = z.object({
    // Rejestracje
    Registrations: z.array(RegistrationTupleSchema).nullable().default([]),
    Schedule: z.array(WorkerScheduleExtSchema).nullable().default([]),
    Settlement: z.array(Settlement2Schema).nullable().default([]),
    DutyRegistrations: z.array(RegistrationTupleSchema).nullable().default([]),
    
    // Obliczone w�a�ciwo�ci - readonly
    FirstIn: z.string().optional(),
    FirstInDuty: z.string().optional(),
    LastOut: z.string().optional(),
    LastOutDuty: z.string().optional(),
    LastOutDateTime: z.string().transform(val => new Date(val)).optional(),
    BreakTime: z.string().optional(),
    RegistrationsSummary: z.string().optional(),
    DutyRegistrationsSummary: z.string().optional(),
    
    // Ostatnie ��danie
    LastReq: VacancyRequestSchema.nullable().optional(),
    
    // Daty i godziny
    RequestDate: z.string().transform(val => new Date(val)),
    HourFrom: z.string().transform(val => new Date(val)).nullable().optional(),
    HourTo: z.string().transform(val => new Date(val)).nullable().optional(),
    HourFromDuty: z.string().transform(val => new Date(val)).nullable().optional(),
    HourToDuty: z.string().transform(val => new Date(val)).nullable().optional(),
    AllowHourFrom: z.string().transform(val => new Date(val)).nullable().optional(),
    AllowHourTo: z.string().transform(val => new Date(val)).nullable().optional(),
    
    // Minuty
    MinuteFrom: z.number().optional(),
    MinuteTo: z.number().optional(),
    
    // Komentarz
    Comment: z.string().nullable().default(''),
    
    // Strefy
    CurrentZone: z.string().nullable().default(''),
    AvailableZones: z.record(z.string(), z.string()).nullable().default({}),
    CurrentZoneFull: z.string().nullable().default(''),
    CurrentZoneFrom: z.string().transform(val => new Date(val)).optional(),
    CurrentZoneTo: z.string().transform(val => new Date(val)).optional(),
    
    // Zam�wienia i aktywno�ci
    CurrentBulkOrderId: z.number().nullable().optional(),
    CurrentOrderNb: z.number().nullable().optional(),
    CurrentOrder_Detail_Activity: z.string().nullable().default(''),
    CurrentDetailNb: z.number().nullable().optional(),
    CurrentActivityNb: z.number().nullable().optional(),
    
    // Listy aktywno�ci
    GroupedActivity: z.array(BuldOrderSchema).nullable().default([]),
    ActivityProgress: z.array(ActivityProgressSchema).nullable().default([]),
    CurrentProgress: z.array(ActivityProgressSchema).nullable().default([]),
    CurrentGroupedProgress: z.array(ActivityProgressSchema).nullable().default([]),
    
    // Obliczone ID aktywno�ci
    CurrentProgressActivityIds: z.string().optional(),
    
    // Dost�pne opcje
    AvailableGroupedOrders: z.record(z.string(), OrderSchema).nullable().default({}),
    AvailableOrders: z.record(z.string(), OrderSchema).nullable().default({}),
    AvailableDetails: z.record(z.string(), DetailSchema).nullable().default({}),
    AvailableActivities: z.record(z.string(), ActivitySchema).nullable().default({}),
    
    // Daty zam�wie�
    CurrentOrderFrom: z.string().transform(val => new Date(val)).optional(),
    CurrentOrderTo: z.string().transform(val => new Date(val)).optional(),
    
    // Wiadomo�ci i flagi
    Message: z.string().nullable().default(''),
    FirstDutyIn: z.string().nullable().default(''),
    LastDutyReq: z.unknown().nullable().optional(),
    ReadOnly: z.boolean().optional().default(false),
});

export type WorkerRegModel = z.infer<typeof WorkerRegModelSchema>;