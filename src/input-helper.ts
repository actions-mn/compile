import { getInput } from "@actions/core";
import { resolve } from "path";
import type { ICompileSettings } from "./compile-settings.js";

export async function getInputs(): Promise<ICompileSettings> {
  const result: ICompileSettings = {
    // Required inputs
    inputFile: getInputFile(),
    type: getType(),

    // Optional inputs
    extensions: getInput("extensions") || "",
    format: getInput("format") || "",
    require: getInput("require") || "",
    wrapper: getBooleanInput("wrapper"),
    asciimath: getBooleanInput("asciimath"),
    datauriimage: getBooleanInput("datauriimage"),
    relaton: getInput("relaton") || "",
    extract: getInput("extract") || "",
    outputDir: getOutputDir(),
    agreeToTerms: getBooleanInput("agree-to-terms"),
    installFonts: getBooleanInput("install-fonts", "true"),
    continueWithoutFonts: getBooleanInput("continue-without-fonts"),
    noProgress: getBooleanInput("no-progress", "true"),
    useBundler: getBooleanInput("use-bundler"),

    // Computed
    workspacePath: getWorkspacePath(),
  };

  return result;
}

function getInputFile(): string {
  const input = getInput("input-file", { required: true });
  return validatePath(input, "input-file");
}

function getType(): string {
  const input = getInput("type", { required: true });
  // Validate type contains only valid characters
  if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
    throw new Error(`Invalid characters in type: ${input}`);
  }
  return input;
}

function getOutputDir(): string {
  const input = getInput("output-dir") || "";
  if (input) {
    return validatePath(input, "output-dir");
  }
  return input;
}

function getBooleanInput(
  name: string,
  defaultValue: string = "false",
): boolean {
  const value = getInput(name) || defaultValue;
  if (value !== "true" && value !== "false") {
    throw new Error(`Invalid boolean value for ${name}: ${value}`);
  }
  return value === "true";
}

function getWorkspacePath(): string {
  const workspacePath = process.env["GITHUB_WORKSPACE"];
  if (!workspacePath) {
    throw new Error("GITHUB_WORKSPACE not defined");
  }
  return resolve(workspacePath);
}

export function validatePath(input: string, paramName: string): string {
  // Check for path traversal
  if (input.includes("..")) {
    throw new Error(`Path traversal detected in ${paramName}: ${input}`);
  }

  // Check for absolute paths outside workspace
  if (input.startsWith("/") && !input.startsWith("/github/workspace")) {
    throw new Error(`Absolute path not allowed in ${paramName}: ${input}`);
  }

  // Check path length
  if (input.length > 255) {
    throw new Error(`Path too long in ${paramName} (max 255 characters)`);
  }

  return input;
}

export function validateFilename(filename: string, paramName: string): void {
  // Check for invalid characters
  if (/[^a-zA-Z0-9._-]/.test(filename)) {
    throw new Error(`Invalid characters in ${paramName}: ${filename}`);
  }

  // Check filename length
  if (filename.length > 100) {
    throw new Error(`Filename too long in ${paramName} (max 100 characters)`);
  }
}
