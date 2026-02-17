import { describe, it, expect } from "vitest";
import { Version, MINIMUM_MODERN_VERSION } from "../src/version-helper.js";

describe("Version", () => {
  describe("parse", () => {
    it("should parse valid version strings", () => {
      const v1 = Version.parse("1.10.0");
      expect(v1.toString()).toBe("1.10.0");
    });

    it("should parse version with single digits", () => {
      const v1 = Version.parse("1.2.3");
      expect(v1.toString()).toBe("1.2.3");
    });

    it("should throw on invalid version format", () => {
      expect(() => Version.parse("invalid")).toThrow("Invalid version format");
      expect(() => Version.parse("1.2")).toThrow("Invalid version format");
    });
  });

  describe("gte", () => {
    it("should return true for equal versions", () => {
      const v1 = Version.parse("1.10.0");
      const v2 = Version.parse("1.10.0");
      expect(v1.gte(v2)).toBe(true);
    });

    it("should compare major versions correctly", () => {
      const v2 = Version.parse("2.0.0");
      const v1 = Version.parse("1.0.0");
      expect(v2.gte(v1)).toBe(true);
      expect(v1.gte(v2)).toBe(false);
    });

    it("should compare minor versions correctly", () => {
      const v110 = Version.parse("1.10.0");
      const v19 = Version.parse("1.9.0");
      expect(v110.gte(v19)).toBe(true);
      expect(v19.gte(v110)).toBe(false);
    });

    it("should compare patch versions correctly", () => {
      const v1101 = Version.parse("1.10.1");
      const v1100 = Version.parse("1.10.0");
      expect(v1101.gte(v1100)).toBe(true);
      expect(v1100.gte(v1101)).toBe(false);
    });

    it("should handle minimum modern version check", () => {
      const v110 = Version.parse("1.10.0");
      const v109 = Version.parse("1.9.9");
      const v111 = Version.parse("1.11.0");

      expect(v110.gte(MINIMUM_MODERN_VERSION)).toBe(true);
      expect(v109.gte(MINIMUM_MODERN_VERSION)).toBe(false);
      expect(v111.gte(MINIMUM_MODERN_VERSION)).toBe(true);
    });
  });

  describe("lt", () => {
    it("should return true when version is less than other", () => {
      const v109 = Version.parse("1.9.9");
      const v110 = Version.parse("1.10.0");

      expect(v109.lt(v110)).toBe(true);
      expect(v110.lt(v109)).toBe(false);
    });

    it("should return false for equal versions", () => {
      const v1 = Version.parse("1.10.0");
      const v2 = Version.parse("1.10.0");
      expect(v1.lt(v2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return formatted version string", () => {
      const v1 = Version.parse("1.10.0");
      expect(v1.toString()).toBe("1.10.0");
    });
  });
});
