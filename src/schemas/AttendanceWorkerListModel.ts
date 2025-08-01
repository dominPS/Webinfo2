import { z } from 'zod';

// Navigation model (same for all)
export const AttendanceListNavigationModelSchema = z.object({
    WorkerCount: z.number(),
    GuestCount: z.number(),
    GuestPresenceCount: z.number(),
    VehicleCount: z.number(),
});

// AttendanceReportElement (for workers)
export const AttendanceReportElementSchema = z.object({
    IdWorker: z.number(),
    Badge: z.number(),
    Name: z.string(),
    Surname: z.string(),
    Presence: z.string(),
    Date: z.string().nullable().optional(),
    Time: z.string().nullable().optional(),
    Group: z.string(),
    Department: z.string(),
    Position: z.string().nullable().optional(),
    DeviceName: z.string().nullable().optional(),
    DeviceId: z.number().nullable().optional(),
    ZoneName: z.string().nullable().optional(),
    ZoneId: z.number().nullable().optional(),
    LastActivity: z.string().nullable().optional(),
    WorkTime: z.string().nullable().optional(),
    OverTime: z.string().nullable().optional(),
    BreakTime: z.string().nullable().optional(),
    Status: z.string().nullable().optional(),
    Photo: z.string().nullable().optional(),
    Email: z.string().nullable().optional(),
    Phone: z.string().nullable().optional(),
});

// POPRAWKA - Updated based on actual guest data structure
export const AttendanceGuestReportElementSchema = z.object({
    CardLog: z.number(),
    CardPhys: z.number(),
    CardType: z.string(),
    Name: z.string(),
    Surname: z.string(),
    Company: z.string().nullable().optional(),
    Document: z.string().nullable().optional(),
    Purpose: z.string().nullable().optional(),
    ReleaseDate: z.string().nullable().optional(),
    ReturnDate: z.string().nullable().optional(),
    ToWhom: z.string().nullable().optional(),
    // Additional fields that might be present
    Badge: z.number().nullable().optional(),
    Presence: z.string().nullable().optional(),
    Date: z.string().nullable().optional(),
    Time: z.string().nullable().optional(),
    DeviceName: z.string().nullable().optional(),
    DeviceId: z.number().nullable().optional(),
    ZoneName: z.string().nullable().optional(),
    ZoneId: z.number().nullable().optional(),
}).passthrough(); // Allow additional fields we might have missed

// POPRAWKA - Updated for guest presence (will be updated after we see the actual data)
export const AttendanceGuestPresenceReportElementSchema = z.object({
    IdGuest: z.number(),
    FirstName: z.string(),
    LastName: z.string(),
    Identity: z.string().nullable().optional(),
    Company: z.string().nullable().optional(),
    Obecnosc: z.string(), // "Obecny" means present
    LastVisit: z.string().nullable().optional(),
    IdPrzypisania: z.number().optional(),
    Id: z.number().optional(),
    NumerLogiczny: z.number().optional(),
    NumerFizyczny: z.number().optional(),
    TypKarty: z.string().nullable().optional(),
    CelWizyty: z.string().nullable().optional(),
    DoKogo: z.string().nullable().optional(),
    DataWydania: z.string().nullable().optional(),
    DataZwrotu: z.string().nullable().optional(),
    Dokument: z.string().nullable().optional(),
    Telefon: z.string().nullable().optional(),
    Email: z.string().nullable().optional(),
    Uwagi: z.string().nullable().optional(),
    DataModyfikacji: z.string().nullable().optional(),
    // Keep legacy fields for backward compatibility
    IdGuestPresence: z.number().optional(),
    GuestName: z.string().optional(),
    GuestSurname: z.string().optional(),
    Name: z.string().optional(),
    Surname: z.string().optional(),
    Presence: z.string().optional(),
    EntryDate: z.string().nullable().optional(),
    ExitDate: z.string().nullable().optional(),
    Duration: z.string().nullable().optional(),
    DeviceName: z.string().nullable().optional(),
    ZoneName: z.string().nullable().optional(),
    ContactPerson: z.string().nullable().optional(),
    Badge: z.number().nullable().optional(),
    Date: z.string().nullable().optional(),
    Time: z.string().nullable().optional(),
    DeviceId: z.number().nullable().optional(),
    ZoneId: z.number().nullable().optional(),
    CardLog: z.number().optional(),
    CardPhys: z.number().optional(),
    CardType: z.string().optional(),
    Document: z.string().nullable().optional(),
    Purpose: z.string().nullable().optional(),
    ReleaseDate: z.string().nullable().optional(),
    ReturnDate: z.string().nullable().optional(),
    ToWhom: z.string().nullable().optional(),
}).passthrough(); // Allow additional fields

// POPRAWKA - Updated for vehicles (will be updated after we see the actual data)
export const AttendanceVehicleReportElementSchema = z.object({
    VehicleType: z.string().nullable().optional(),
    VehicleNumber: z.string(),
    VehicleNote: z.string().nullable().optional(),
    LastDate: z.string().nullable().optional(),
    Driver: z.string().nullable().optional(),
    // Keep optional fields for backward compatibility
    IdVehicle: z.number().optional(),
    PlateNumber: z.string().optional(),
    DriverName: z.string().nullable().optional(),
    DriverSurname: z.string().nullable().optional(),
    Name: z.string().optional(),
    Surname: z.string().optional(),
    Presence: z.string().optional(),
    Date: z.string().nullable().optional(),
    Time: z.string().nullable().optional(),
    DeviceName: z.string().nullable().optional(),
    DeviceId: z.number().nullable().optional(),
    ZoneName: z.string().nullable().optional(),
    ZoneId: z.number().nullable().optional(),
    Company: z.string().nullable().optional(),
    Badge: z.number().nullable().optional(),
    Group: z.string().nullable().optional(),
    Department: z.string().nullable().optional(),
    Position: z.string().nullable().optional(),
    CardLog: z.number().optional(),
    CardPhys: z.number().optional(),
    CardType: z.string().optional(),
    Document: z.string().nullable().optional(),
    Purpose: z.string().nullable().optional(),
    ReleaseDate: z.string().nullable().optional(),
    ReturnDate: z.string().nullable().optional(),
    ToWhom: z.string().nullable().optional(),
}).passthrough(); // Allow additional fields

// Main model schemas
export const AttendanceWorkerListModelSchema = z.object({
    Navigation: AttendanceListNavigationModelSchema,
    Elements: z.array(AttendanceReportElementSchema),
});

export const AttendanceGuestListModelSchema = z.object({
    Navigation: AttendanceListNavigationModelSchema,
    Elements: z.array(AttendanceGuestReportElementSchema),
});

export const AttendanceGuestPresenceListModelSchema = z.object({
    Navigation: AttendanceListNavigationModelSchema,
    Elements: z.array(AttendanceGuestPresenceReportElementSchema),
});

export const AttendanceVehicleListModelSchema = z.object({
    Navigation: AttendanceListNavigationModelSchema,
    Elements: z.array(AttendanceVehicleReportElementSchema),
});

// TypeScript types
export type AttendanceListNavigationModel = z.infer<typeof AttendanceListNavigationModelSchema>;
export type AttendanceReportElement = z.infer<typeof AttendanceReportElementSchema>;
export type AttendanceGuestReportElement = z.infer<typeof AttendanceGuestReportElementSchema>;
export type AttendanceGuestPresenceReportElement = z.infer<typeof AttendanceGuestPresenceReportElementSchema>;
export type AttendanceVehicleReportElement = z.infer<typeof AttendanceVehicleReportElementSchema>;
export type AttendanceWorkerListModel = z.infer<typeof AttendanceWorkerListModelSchema>;
export type AttendanceGuestListModel = z.infer<typeof AttendanceGuestListModelSchema>;
export type AttendanceGuestPresenceListModel = z.infer<typeof AttendanceGuestPresenceListModelSchema>;
export type AttendanceVehicleListModel = z.infer<typeof AttendanceVehicleListModelSchema>;

// Default values
export const createDefaultAttendanceWorkerListModel = (): AttendanceWorkerListModel => ({
    Navigation: {
        WorkerCount: 0,
        GuestCount: 0,
        GuestPresenceCount: 0,
        VehicleCount: 0,
    },
    Elements: [],
});

export const createDefaultAttendanceReportElement = (): AttendanceReportElement => ({
    IdWorker: 0,
    Badge: 0,
    Name: '',
    Surname: '',
    Presence: '',
    Group: '',
    Department: '',
});