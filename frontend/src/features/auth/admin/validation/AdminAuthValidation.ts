import { z } from 'zod'

export const AdminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),

  password: z
    .string()
    .min(1, 'Password is required'),
})

export type AdminLoginSchema = z.infer<
  typeof AdminLoginSchema
>


export const getValidationErrors = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
):
  | { success: true; data: z.infer<T> }
  | { success: false; errors: Record<string, string> } => {

  const result = schema.safeParse(data)

  if (result.success) {
    return {
      success: true,
      data: result.data,
    }
  }

  const errors: Record<string, string> = {}

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as string

    if (!errors[field]) {
      errors[field] = issue.message
    }
  })

  return {
    success: false,
    errors,
  }
}