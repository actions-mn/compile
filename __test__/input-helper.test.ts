import { describe, it, expect } from "vitest";
import { validatePath, validateFilename } from "../src/input-helper.js";

describe("Input Validation", () => {
  describe("validatePath", () => {
    it("should accept relative paths", () => {
      expect(validatePath(".", "source-path")).toBe(".");
      expect(validatePath("docs", "source-path")).toBe("docs");
      expect(validatePath("path/to/docs", "source-path")).toBe("path/to/docs");
    });

    it("should reject path traversal", () => {
      expect(() => validatePath("../etc", "source-path")).toThrow(
        "Path traversal detected",
      );
      expect(() => validatePath("foo/../bar", "source-path")).toThrow(
        "Path traversal detected",
      );
    });

    it("should reject absolute paths outside workspace", () => {
      expect(() => validatePath("/etc/passwd", "source-path")).toThrow(
        "Absolute path not allowed",
      );
    });

    it("should accept workspace absolute paths", () => {
      expect(() =>
        validatePath("/github/workspace/repo", "source-path"),
      ).not.toThrow();
    });

    it("should reject paths exceeding max length", () => {
      const longPath = "a".repeat(256);
      expect(() => validatePath(longPath, "source-path")).toThrow(
        "Path too long",
      );
    });
  });

  describe("validateFilename", () => {
    it("should accept valid filenames", () => {
      expect(() =>
        validateFilename("metanorma.yml", "config-file"),
      ).not.toThrow();
      expect(() =>
        validateFilename("config.yaml", "config-file"),
      ).not.toThrow();
      expect(() =>
        validateFilename("123_test.config", "config-file"),
      ).not.toThrow();
    });

    it("should reject filenames with invalid characters", () => {
      expect(() => validateFilename("config file.yml", "config-file")).toThrow(
        "Invalid characters",
      );
      expect(() => validateFilename("config;ls", "config-file")).toThrow(
        "Invalid characters",
      );
      expect(() => validateFilename("config${IFS}file", "config-file")).toThrow(
        "Invalid characters",
      );
    });

    it("should reject filenames exceeding max length", () => {
      const longName = "a".repeat(101) + ".yml";
      expect(() => validateFilename(longName, "config-file")).toThrow(
        "Filename too long",
      );
    });
  });
});
