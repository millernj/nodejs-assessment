import { z } from 'zod';

export const addressSchema = z.object({
  street:  z.string().min(1),
  city:    z.string().min(1),
  state:   z.string().length(2),
  zipCode: z.string().min(5),
});

export type Address = z.infer<typeof addressSchema>;
