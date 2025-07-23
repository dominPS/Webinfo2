import { z } from 'zod';

export const WorkerDeclareLimitSchema = z.object({
    // Dla teraz pusty obiekt - mo�e by� null z API
}).nullable().optional().default(null);

export type WorkerDeclareLimit = z.infer<typeof WorkerDeclareLimitSchema>;