import { z } from 'zod';
import { WorkerSchema } from './Worker';
import { WorkerRegModelSchema } from './WorkerRegModel';
import { WorkerAreaRegModelSchema } from './WorkerAreaRegModel';
import { PlanowanieModelSchema } from './PlanowanieModel';
import { ManagerModelSchema } from './ManagerModel';
import { WorkerDaysToReceiveSchema } from './WorkerDaysToReceive';
import { WorkerWolModelSchema } from './WorkerWolModel';
import { WorkerDeclareLimitSchema } from './WorkerDeclareLimit';

export const WorkerModelSchema = WorkerSchema.extend({
    CommentIsError: z.boolean(),

    // Zastąp z.any() właściwymi schematami - teraz opcjonalne lub nullable
    WorkerRegModel: WorkerRegModelSchema.nullable().optional(),
    WorkerAreaRegModel: WorkerAreaRegModelSchema.nullable().optional(),
    PlanowanieModel: PlanowanieModelSchema.nullable().optional(),
    ManagerModel: ManagerModelSchema.nullable().optional(),
    WorkerDaysToReceive: WorkerDaysToReceiveSchema.nullable().optional(),
    WorkerWolModel: WorkerWolModelSchema.nullable().optional(),
    WorkerDeclareLimit: WorkerDeclareLimitSchema.nullable().optional(),

    IsBeginAvailable: z.boolean(),
    IsEndAvailable: z.boolean(),
    IsEndAtEndAvailable: z.boolean(),
    IsBreakAvailable: z.boolean(),
    IsPendingRequest: z.boolean(),

    Email: z.string().email().nullable().default(''),
    Phone: z.string().nullable().default(''),
    ConsentLastChange: z.string()
        .nullable()
        .refine(val => val === null || /^\/Date\(\d+\)\/$/.test(val), {
            message: "Invalid Microsoft date format",
        }),

    Consent_OnDemand: z.boolean(),
    Consent_Mailing: z.boolean(),
    Consent_Sms: z.boolean(),
    Consent_MailingPit: z.boolean(),
    Consent_MailingOveral: z.boolean(),

    StawkaGodzAkt: z.string().nullable().default(''),
    StawkaZasadniczaAkt: z.string().nullable().default(''),
    DodatekZasadniczyAkt: z.string().nullable().default(''),

    Code: z.string().nullable().default(''),
    IsAutoNormAfterReg: z.boolean(),
    IsAutoNorm: z.boolean(),
    ProjectGroup: z.string().nullable().default(''),
    OrderGroup: z.string().nullable().default(''),
    IsLastDayNotOver: z.boolean(),

    RCPReaders: z.string().nullable().default(''),
    RCPReadersList: z.array(z.string()).nullable(),

    NonRCPReader: z.boolean(),
});

export type WorkerModel = z.infer<typeof WorkerModelSchema>;