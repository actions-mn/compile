import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { CompileCommandManager } from "../src/compile-command-manager.js";
import type { ICompileSettings } from "../src/compile-settings.js";
import { mkdirSync, rmSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

describe("CompileCommandManager", () => {
  const defaultSettings: ICompileSettings = {
    inputFile: "test.adoc",
    type: "iso",
    extensions: "",
    format: "",
    require: "",
    wrapper: false,
    asciimath: false,
    datauriimage: false,
    relaton: "",
    extract: "",
    outputDir: "",
    agreeToTerms: false,
    installFonts: true,
    continueWithoutFonts: false,
    noProgress: true,
    useBundler: false,
    workspacePath: "/github/workspace",
  };

  describe("getCompileCommand", () => {
    it("should build basic command with required inputs", () => {
      const manager = new CompileCommandManager(defaultSettings);
      const cmd = manager.getCompileCommand();

      expect(cmd).toContain("metanorma");
      expect(cmd).toContain("compile");
      expect(cmd).toContain("test.adoc");
      expect(cmd).toContain("--type");
      expect(cmd).toContain("iso");
    });

    it("should include extensions when specified", () => {
      const settings = { ...defaultSettings, extensions: "html,doc" };
      const manager = new CompileCommandManager(settings);
      const cmd = manager.getCompileCommand();

      expect(cmd).toContain("--extensions=html,doc");
    });

    it("should include format when specified", () => {
      const settings = { ...defaultSettings, format: "asciidoc" };
      const manager = new CompileCommandManager(settings);
      const cmd = manager.getCompileCommand();

      expect(cmd).toContain("--format=asciidoc");
    });

    it("should include require when specified", () => {
      const settings = { ...defaultSettings, require: "asciidoctor-bibtex" };
      const manager = new CompileCommandManager(settings);
      const cmd = manager.getCompileCommand();

      expect(cmd).toContain("--require=asciidoctor-bibtex");
    });

    it("should handle wrapper flag correctly", () => {
      const settingsTrue = { ...defaultSettings, wrapper: true };
      const managerTrue = new CompileCommandManager(settingsTrue);
      expect(managerTrue.getCompileCommand()).toContain("--wrapper");
      expect(managerTrue.getCompileCommand()).not.toContain("--no-wrapper");

      const settingsFalse = { ...defaultSettings, wrapper: false };
      const managerFalse = new CompileCommandManager(settingsFalse);
      expect(managerFalse.getCompileCommand()).toContain("--no-wrapper");
    });

    it("should handle asciimath flag correctly", () => {
      const settingsTrue = { ...defaultSettings, asciimath: true };
      const managerTrue = new CompileCommandManager(settingsTrue);
      expect(managerTrue.getCompileCommand()).toContain("--asciimath");

      const settingsFalse = { ...defaultSettings, asciimath: false };
      const managerFalse = new CompileCommandManager(settingsFalse);
      expect(managerFalse.getCompileCommand()).toContain("--no-asciimath");
    });

    it("should handle datauriimage flag correctly", () => {
      const settingsTrue = { ...defaultSettings, datauriimage: true };
      const managerTrue = new CompileCommandManager(settingsTrue);
      expect(managerTrue.getCompileCommand()).toContain("--datauriimage");

      const settingsFalse = { ...defaultSettings, datauriimage: false };
      const managerFalse = new CompileCommandManager(settingsFalse);
      expect(managerFalse.getCompileCommand()).toContain("--no-datauriimage");
    });

    it("should include relaton when specified", () => {
      const settings = { ...defaultSettings, relaton: "relaton.xml" };
      const manager = new CompileCommandManager(settings);
      const cmd = manager.getCompileCommand();

      expect(cmd).toContain("--relaton=relaton.xml");
    });

    it("should include extract when specified", () => {
      const settings = { ...defaultSettings, extract: "./extracted" };
      const manager = new CompileCommandManager(settings);
      const cmd = manager.getCompileCommand();

      expect(cmd).toContain("--extract=./extracted");
    });

    it("should include output-dir when specified", () => {
      const settings = { ...defaultSettings, outputDir: "./output" };
      const manager = new CompileCommandManager(settings);
      const cmd = manager.getCompileCommand();

      expect(cmd).toContain("--output-dir=./output");
    });

    it("should handle agree-to-terms flag correctly", () => {
      const settingsTrue = { ...defaultSettings, agreeToTerms: true };
      const managerTrue = new CompileCommandManager(settingsTrue);
      expect(managerTrue.getCompileCommand()).toContain("--agree-to-terms");

      const settingsFalse = { ...defaultSettings, agreeToTerms: false };
      const managerFalse = new CompileCommandManager(settingsFalse);
      expect(managerFalse.getCompileCommand()).toContain("--no-agree-to-terms");
    });

    it("should handle install-fonts flag correctly", () => {
      const settingsTrue = { ...defaultSettings, installFonts: true };
      const managerTrue = new CompileCommandManager(settingsTrue);
      expect(managerTrue.getCompileCommand()).toContain("--install-fonts");

      const settingsFalse = { ...defaultSettings, installFonts: false };
      const managerFalse = new CompileCommandManager(settingsFalse);
      expect(managerFalse.getCompileCommand()).toContain("--no-install-fonts");
    });

    it("should handle continue-without-fonts flag correctly", () => {
      const settingsTrue = { ...defaultSettings, continueWithoutFonts: true };
      const managerTrue = new CompileCommandManager(settingsTrue);
      expect(managerTrue.getCompileCommand()).toContain(
        "--continue-without-fonts",
      );

      const settingsFalse = { ...defaultSettings, continueWithoutFonts: false };
      const managerFalse = new CompileCommandManager(settingsFalse);
      expect(managerFalse.getCompileCommand()).toContain(
        "--no-continue-without-fonts",
      );
    });

    it("should handle no-progress flag correctly (inverted logic)", () => {
      const settingsTrue = { ...defaultSettings, noProgress: true };
      const managerTrue = new CompileCommandManager(settingsTrue);
      expect(managerTrue.getCompileCommand()).toContain("--no-progress");

      const settingsFalse = { ...defaultSettings, noProgress: false };
      const managerFalse = new CompileCommandManager(settingsFalse);
      expect(managerFalse.getCompileCommand()).toContain("--progress");
    });

    it("should build complete command with all options", () => {
      const settings: ICompileSettings = {
        inputFile: "document.adoc",
        type: "iso",
        extensions: "html,doc,pdf",
        format: "asciidoc",
        require: "asciidoctor-bibtex",
        wrapper: true,
        asciimath: true,
        datauriimage: true,
        relaton: "relaton.xml",
        extract: "./extracted",
        outputDir: "./output",
        agreeToTerms: true,
        installFonts: true,
        continueWithoutFonts: true,
        noProgress: true,
        useBundler: false,
        workspacePath: "/github/workspace",
      };
      const manager = new CompileCommandManager(settings);
      const cmd = manager.getCompileCommand();

      expect(cmd).toContain("metanorma");
      expect(cmd).toContain("compile");
      expect(cmd).toContain("document.adoc");
      expect(cmd).toContain("--type");
      expect(cmd).toContain("iso");
      expect(cmd).toContain("--extensions=html,doc,pdf");
      expect(cmd).toContain("--format=asciidoc");
      expect(cmd).toContain("--require=asciidoctor-bibtex");
      expect(cmd).toContain("--wrapper");
      expect(cmd).toContain("--asciimath");
      expect(cmd).toContain("--datauriimage");
      expect(cmd).toContain("--relaton=relaton.xml");
      expect(cmd).toContain("--extract=./extracted");
      expect(cmd).toContain("--output-dir=./output");
      expect(cmd).toContain("--agree-to-terms");
      expect(cmd).toContain("--install-fonts");
      expect(cmd).toContain("--continue-without-fonts");
      expect(cmd).toContain("--no-progress");
    });
  });
});
