import { z } from "zod";

const phoneRegex = /^[6-9]\d{9}$/;

export const addStaffSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name must be less than 50 characters")
      .regex(/^[A-Za-z\s]+$/, "Full name can contain only letters"),

    mobileNumber: z
      .string()
      .trim()
      .regex(phoneRegex, "Please enter a valid mobile number"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    role: z.enum(["driver", "conductor"], {
      message: "Please select a valid role",
    }),

    joiningDate: z
      .string()
      .trim()
      .min(1, "Joining date is required")
      .refine(
        (date) => !Number.isNaN(new Date(date).getTime()),
        "Please enter a valid joining date"
      )
      .refine(
        (date) => new Date(date) <= new Date(),
        "Joining date cannot be in the future"
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter"
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter"
      )
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AddStaffSchema = z.infer<typeof addStaffSchema>;

// Used when editing an existing staff member.
// Unlike addStaffSchema, this has no password/confirmPassword (edit
// modal never touches credentials) and uses "phone" instead of
// "mobileNumber" to match the edit form's field names exactly.
export const editStaffSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Full name can contain only letters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid mobile number"),

  role: z.enum(["driver", "conductor"], {
    message: "Please select a valid role",
  }),

  joiningDate: z
    .string()
    .trim()
    .min(1, "Joining date is required")
    .refine(
      (date) => !Number.isNaN(new Date(date).getTime()),
      "Please enter a valid joining date"
    )
    .refine(
      (date) => new Date(date) <= new Date(),
      "Joining date cannot be in the future"
    ),
});

export type EditStaffSchema = z.infer<typeof editStaffSchema>;

export const getValidationErrors = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
):
  | { success: true; data: z.infer<T> }
  | { success: false; errors: Record<string, string> } => {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const errors: Record<string, string> = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as string;

    if (!errors[field]) {
      errors[field] = issue.message;
    }
  });

  return {
    success: false,
    errors,
  };
};