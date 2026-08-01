import { z } from "zod";

const phoneRegex = /^[6-9]\d{9}$/;
const gstRegex =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const operatorRegisterSchema = z
  .object({
    ownerName: z
      .string()
      .trim()
      .min(2, "Owner name must be at least 2 characters")
      .max(50, "Owner name must be less than 50 characters")
      .regex(
        /^[A-Za-z\s]+$/,
        "Owner name can contain only letters"
      ),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    phone: z
      .string()
      .trim()
      .regex(phoneRegex, "Please enter a valid mobile number"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z
      .string()
      .min(1, "Confirm Password is required"),

    legalEntityName: z
      .string()
      .trim()
      .min(2, "Legal Entity Name is required")
      .max(100, "Legal Entity Name is too long"),

    gstNumber: z
      .string()
      .trim()
      .regex(gstRegex, "Please enter a valid GST Number"),

    yearOfIncorporation: z
      .string()
      .trim()
      .regex(/^\d{4}$/, "Enter a valid year")
      .refine(
        (year) =>
          Number(year) >= 1900 &&
          Number(year) <= new Date().getFullYear(),
        {
          message: "Enter a valid incorporation year",
        }
      ),

    panNumber: z
      .string()
      .trim()
      .regex(panRegex, "Please enter a valid PAN Number"),

    authorisedRepresentative: z
      .string()
      .trim()
      .min(2, "Authorised Representative is required")
      .max(50, "Authorised Representative is too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const operatorLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});


export type OperatorRegisterSchema = z.infer<
  typeof operatorRegisterSchema
>;
export type OperatorLoginSchema = z.infer<
  typeof operatorLoginSchema
>;
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