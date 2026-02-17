import { describe, it, expect, afterEach } from "vitest";
import { directoryExistsSync } from "../src/fs-helper.js";
import { mkdirSync, rmdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

describe("fs-helper", () => {
  describe("directoryExistsSync", () => {
    const testDir = join(tmpdir(), "compile-fs-test-" + Date.now());

    afterEach(() => {
      try {
        rmdirSync(testDir);
      } catch {
        // Ignore errors if directory doesn't exist
      }
    });

    it("should return false if directory does not exist", () => {
      expect(directoryExistsSync("/nonexistent/path")).toBe(false);
    });

    it("should return true if directory exists", () => {
      mkdirSync(testDir, { recursive: true });
      expect(directoryExistsSync(testDir)).toBe(true);
    });

    it("should throw if required and directory does not exist", () => {
      expect(() => directoryExistsSync("/nonexistent/path", true)).toThrow(
        "Directory does not exist",
      );
    });

    it("should throw if path is not a directory", () => {
      // Use a file that we know exists (this test file)
      const testFile = __filename;
      expect(() => directoryExistsSync(testFile)).toThrow(
        "Path is not a directory",
      );
    });
  });
});
