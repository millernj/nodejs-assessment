import { z } from 'zod';
import { addressSchema as AddressSchema } from "@/common/models/address";
import { idSchema as IdSchema } from "@/common/models/id";

export const UserSchema = z.object({
  id:      IdSchema,
  name:    z.string().min(3).max(50),
  email:   z.string().email(),
  address: AddressSchema,
}).strict();

export const UserParamSchema = z.object({ id: IdSchema }).strict();

export const CreateUserSchema = UserSchema.omit({ id: true }).strict();

export const UpdateUserSchema = CreateUserSchema.partial();


export type User = z.infer<typeof UserSchema>

export type CreateUserPayload = z.infer<typeof CreateUserSchema>

export type UpdateUserPayload = z.infer<typeof UpdateUserSchema>
