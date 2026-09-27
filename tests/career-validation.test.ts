import { describe, expect, test } from "bun:test";
import {
  careerSchema,
  validateCareerFile,
  MAX_CAREER_FILE_SIZE,
} from "../src/lib/career-validation";

describe("career document validation", () => {
  test("accepts supported files and supplies MIME for browsers that omit it", () => {
    expect(validateCareerFile({ name: "CV.PDF", size: 10, type: "" }, "CV")).toEqual({
      extension: "pdf",
      contentType: "application/pdf",
    });
    expect(
      validateCareerFile(
        {
          name: "letter.docx",
          size: MAX_CAREER_FILE_SIZE,
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
        "Letter",
      ).extension,
    ).toBe("docx");
    expect(
      validateCareerFile({ name: "cv.doc", size: 20, type: "application/msword" }, "CV").extension,
    ).toBe("doc");
  });
  test.each([
    { name: "cv.exe", size: 10, type: "" },
    { name: "cv.pdf", size: 0, type: "application/pdf" },
    { name: "cv.pdf", size: MAX_CAREER_FILE_SIZE + 1, type: "application/pdf" },
    { name: "cv.pdf", size: 10, type: "text/html" },
    { name: "cv.pdf.exe", size: 10, type: "application/pdf" },
    { name: "a".repeat(256) + ".pdf", size: 10, type: "application/pdf" },
  ])("rejects invalid document %j", (file) =>
    expect(() => validateCareerFile(file, "CV")).toThrow(),
  );
});
describe("career application validation", () => {
  const valid = {
    full_name: " Jane Doe ",
    email: "jane@example.com",
    phone: "+977 123456789",
    country_city: "Kathmandu, Nepal",
    position: "Operations",
    cover_letter: "",
    consent: "on",
  };
  test("trims fields and accepts an open application", () =>
    expect(careerSchema.parse({ ...valid, position: "Open application" }).full_name).toBe(
      "Jane Doe",
    ));
  test("requires applicant consent", () =>
    expect(careerSchema.safeParse({ ...valid, consent: undefined }).success).toBe(false));
  test("rejects blank role, invalid email, and excessive cover letter", () => {
    for (const patch of [
      { position: " " },
      { email: "not an email" },
      { cover_letter: "a".repeat(3001) },
    ])
      expect(careerSchema.safeParse({ ...valid, ...patch }).success).toBe(false);
  });
});
