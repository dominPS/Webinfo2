import { z } from 'zod';

export const RegistrationTupleSchema = z.object({
    // Podstawowe pola daty i czasu
    Date: z.string().transform(val => new Date(val)),
    TimeInDateTime: z.string().transform(val => val ? new Date(val) : new Date(0)).nullable(),
    TimeOutDateTime: z.string().transform(val => val ? new Date(val) : new Date(0)).nullable(),
    
    // Obliczone w³aœciwoœci czasu (readonly)
    TimeIn: z.string().optional(),
    TimeOut: z.string().optional(),
    
    // Identyfikatory rejestracji
    IdWej: z.number().nullable().optional(),
    IdWyj: z.number().nullable().optional(),
    
    // Flagi modyfikacji
    ModWej: z.boolean().optional().default(false),
    ModWyj: z.boolean().optional().default(false),
});

export type RegistrationTuple = z.infer<typeof RegistrationTupleSchema>;

// Utility funkcja do konwersji kolekcji na HTML string (jak w C#)
export const getHtmlString = (collection: RegistrationTuple[]): string => {
    if (!collection || collection.length === 0) return " ";
    
    return collection
        .map(r => {
            const timeIn = r.TimeIn || "";
            const timeOut = r.TimeOut || "";
            return `${timeIn} - ${timeOut}`;
        })
        .join("<br />");
};