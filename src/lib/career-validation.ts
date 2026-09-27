import { z } from "zod";

export const CAREER_BUCKET = "career-documents";
export const MAX_CAREER_FILE_SIZE = 10 * 1024 * 1024;
export const CAREER_FILE_ACCEPT = ".pdf,.doc,.docx";
const documentTypes = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
export function validateCareerFile(file: Pick<File, "name" | "size" | "type">, label: string) {
  const extension = file.name.split(".").pop()?.toLowerCase() as keyof typeof documentTypes;
  if (!extension || !Object.hasOwn(documentTypes, extension))
    throw new Error(`${label} must be a PDF, DOC, or DOCX file.`);
  if (!file.size) throw new Error(`${label} must not be empty.`);
  if (file.size > MAX_CAREER_FILE_SIZE) throw new Error(`${label} must be 10 MB or smaller.`);
  if (file.name.length > 255) throw new Error(`${label} filename must be 255 characters or fewer.`);
  if (file.type && file.type !== documentTypes[extension])
    throw new Error(`${label} file type does not match its extension.`);
  return { extension, contentType: documentTypes[extension] };
}
const required = (max: number) =>
  z.string().trim().min(1, "Please complete all required fields.").max(max);
export const careerSchema = z.object({
  full_name: required(120),
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  phone: required(40).min(4, "Please enter a valid phone number."),
  country_city: required(120),
  position: required(200),
  cover_letter: z.string().trim().max(3000),
  consent: z.literal("on", {
    errorMap: () => ({ message: "Please consent to the review of your application." }),
  }),
});
