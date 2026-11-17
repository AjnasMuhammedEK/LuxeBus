import { z } from "zod";
import { getValidationErrors } from "@/features/operator/staffs/validation/staffValidation";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png"];

// KL10AB1234 (spaces are stripped before testing)
export const REGISTRATION_REGEX = /^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}$/;

export const normalizeRegistration = (value: string) =>
  value.replace(/\s+/g, "").toUpperCase();

const documentSchema = z
  .instanceof(File, { message: "Please upload this document" })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size must be less than 10 MB",
  })
  .refine((file) => allowedFileTypes.includes(file.type), {
    message: "Only PDF, JPG and PNG files are allowed",
  });

export const addBusSchema = z.object({
  manufacturer: z
    .string()
    .trim()
    .min(2, "Manufacturer must be at least 2 characters")
    .max(50, "Manufacturer must be less than 50 characters"),

  model: z
    .string()
    .trim()
    .min(1, "Bus model is required")
    .max(50, "Bus model must be less than 50 characters"),

  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .refine(
      (value) => REGISTRATION_REGEX.test(normalizeRegistration(value)),
      "Enter a valid registration number (e.g. KL 10 AB 1234)"
    ),

  manufacturingYear: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter a valid 4-digit year")
    .refine(
      (year) => Number(year) >= 1990 && Number(year) <= new Date().getFullYear(),
      "Enter a valid manufacturing year"
    ),

  seatLayoutId: z.string().min(1, "Please select a seat layout"),
});

export const busDocumentsSchema = z.object({
  rc: documentSchema,
  fitnessCertificate: documentSchema,
  insurance: documentSchema,
});

export type AddBusSchema = z.infer<typeof addBusSchema>;

export { getValidationErrors };