import { z } from 'zod';
import { WorkerScheduleExtSchema } from './common/WorkerScheduleExt';
import { RegistrationTupleSchema } from './common/RegistrationTuple';

export const WorkerAreaRegModelSchema = z.object({
    // Kolekcje danych
    Schedule: z.array(WorkerScheduleExtSchema).nullable().default([]),
    Registrations: z.array(RegistrationTupleSchema).nullable().default([]),
    
    // RequestDate - akceptuje string lub Date
    RequestDate: z.union([
        z.string().transform(val => new Date(val)),
        z.date(),
        z.undefined()
    ])
    .transform(val => val instanceof Date ? val : val ? new Date(val) : new Date())
    .optional()
    .default(() => new Date()),
    
    // Godziny - z lepsz¹ walidacj¹
    HourFrom: z.union([
        z.string().transform(val => val ? new Date(val) : null),
        z.date(),
        z.null(),
        z.undefined()
    ])
    .transform(val => {
        if (!val) return null;
        return val instanceof Date ? val : new Date(val);
    })
    .nullable()
    .optional(),
    
    HourTo: z.union([
        z.string().transform(val => val ? new Date(val) : null),
        z.date(),
        z.null(),
        z.undefined()
    ])
    .transform(val => {
        if (!val) return null;
        return val instanceof Date ? val : new Date(val);
    })
    .nullable()
    .optional(),
    
    HourFromDuty: z.union([
        z.string().transform(val => val ? new Date(val) : null),
        z.date(),
        z.null(),
        z.undefined()
    ])
    .transform(val => {
        if (!val) return null;
        return val instanceof Date ? val : new Date(val);
    })
    .nullable()
    .optional(),
    
    HourToDuty: z.union([
        z.string().transform(val => val ? new Date(val) : null),
        z.date(),
        z.null(),
        z.undefined()
    ])
    .transform(val => {
        if (!val) return null;
        return val instanceof Date ? val : new Date(val);
    })
    .nullable()
    .optional(),
    
    AllowHourFrom: z.union([
        z.string().transform(val => val ? new Date(val) : null),
        z.date(),
        z.null(),
        z.undefined()
    ])
    .transform(val => {
        if (!val) return null;
        return val instanceof Date ? val : new Date(val);
    })
    .nullable()
    .optional(),
    
    AllowHourTo: z.union([
        z.string().transform(val => val ? new Date(val) : null),
        z.date(),
        z.null(),
        z.undefined()
    ])
    .transform(val => {
        if (!val) return null;
        return val instanceof Date ? val : new Date(val);
    })
    .nullable()
    .optional(),
    
    // Flagi dostêpnoœci
    IsEndAvailable: z.boolean().optional().default(false),
    IsBeginAvailable: z.boolean().optional().default(false),
    
    // Komunikaty i dodatkowe informacje
    Message: z.string().nullable().default(''),
    FirstIn: z.string().optional(),
    
    // Dodatkowe pola dla lepszej funkcjonalnoœci
    LastOut: z.string().optional(),
    BreakTime: z.string().optional(),
    RegistrationsSummary: z.string().optional(),
});

export type WorkerAreaRegModel = z.infer<typeof WorkerAreaRegModelSchema>;

// Utility funkcje
export const createEmptyWorkerAreaRegModel = (): Partial<WorkerAreaRegModel> => ({
    Schedule: [],
    Registrations: [],
    RequestDate: new Date(),
    IsEndAvailable: false,
    IsBeginAvailable: false,
    Message: '',
});

// Funkcja do sprawdzania czy pracownik jest aktualnie w pracy
export const isWorkerCurrentlyAtWork = (model: WorkerAreaRegModel): boolean => {
    if (!model.Registrations || model.Registrations.length === 0) return false;
    
    const lastRegistration = model.Registrations[model.Registrations.length - 1];
    return !!lastRegistration.TimeInDateTime && !lastRegistration.TimeOutDateTime;
};

// Funkcja do obliczania ca³kowitego czasu pracy
export const calculateTotalWorkTime = (registrations: WorkerAreaRegModel['Registrations']): number => {
    if (!registrations) return 0;
    
    return registrations.reduce((total, reg) => {
        if (reg.TimeInDateTime && reg.TimeOutDateTime) {
            const timeIn = new Date(reg.TimeInDateTime);
            const timeOut = new Date(reg.TimeOutDateTime);
            return total + (timeOut.getTime() - timeIn.getTime());
        }
        return total;
    }, 0);
};