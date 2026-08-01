import { z } from 'zod'

const phoneRegex = /^[6-9]\d{9}$/

export const passengerRegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'Name can contain only letters'),

  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),

  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Please enter a valid mobile number'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export type PassengerRegisterSchema = z.infer<
  typeof passengerRegisterSchema
>




export const passengerLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),

  password: z
    .string()
    .min(1, 'Password is required'),
})

export type PassengerLoginSchema = z.infer<
  typeof passengerLoginSchema
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


export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

export type ForgotPasswordSchema = z.infer<
  typeof forgotPasswordSchema
>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),

    confirmPassword: z
      .string()
      .min(1, 'Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ResetPasswordSchema = z.infer<
  typeof resetPasswordSchema
>