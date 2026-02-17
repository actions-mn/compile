import { exec } from "@actions/exec";
import { info, exportVariable } from "@actions/core";
import type { ICompileSettings } from "./compile-settings.js";
import { Version } from "./version-helper.js";

export class CompileCommandManager {
  constructor(private readonly settings: ICompileSettings) {}

  async getVersion(): Promise<Version> {
    const cmd = this.getCommand();
    let output = "";

    const versionCmd = this.settings.useBundler
      ? ["bundle", "exec", cmd, "--version"]
      : [cmd, "--version"];

    await exec(versionCmd[0], versionCmd.slice(1), {
      listeners: {
        stdout: (data: Buffer) => {
          output += data.toString();
        },
        stderr: (data: Buffer) => {
          output += data.toString();
        },
      },
    });

    // Search for version in all output (stdout + stderr)
    // The version line appears like: "Metanorma 2.2.9"
    const lines = output.split("\n");
    for (const line of lines) {
      const match = line.match(/Metanorma\s+(\d+\.\d+\.\d+)/);
      if (match) {
        return Version.parse(match[1]);
      }
    }

    throw new Error(
      `Failed to parse metanorma version from output:\n${output}`,
    );
  }

  getCompileCommand(): string[] {
    const cmd = this.getCommand();
    const args: string[] = ["compile", this.settings.inputFile];

    // Add type (required)
    args.push("--type", this.settings.type);

    // Add extensions if specified
    if (this.settings.extensions) {
      args.push(`--extensions=${this.settings.extensions}`);
    }

    // Add format if specified
    if (this.settings.format) {
      args.push(`--format=${this.settings.format}`);
    }

    // Add require if specified
    if (this.settings.require) {
      args.push(`--require=${this.settings.require}`);
    }

    // Add boolean flags
    args.push(this.settings.wrapper ? "--wrapper" : "--no-wrapper");
    args.push(this.settings.asciimath ? "--asciimath" : "--no-asciimath");
    args.push(
      this.settings.datauriimage ? "--datauriimage" : "--no-datauriimage",
    );

    // Add relaton if specified
    if (this.settings.relaton) {
      args.push(`--relaton=${this.settings.relaton}`);
    }

    // Add extract if specified
    if (this.settings.extract) {
      args.push(`--extract=${this.settings.extract}`);
    }

    // Add output-dir if specified
    if (this.settings.outputDir) {
      args.push(`--output-dir=${this.settings.outputDir}`);
    }

    // Add agree-to-terms
    args.push(
      this.settings.agreeToTerms ? "--agree-to-terms" : "--no-agree-to-terms",
    );

    // Font installation flags (version-dependent, but we use simpler approach here)
    args.push(
      this.settings.installFonts ? "--install-fonts" : "--no-install-fonts",
    );
    args.push(
      this.settings.continueWithoutFonts
        ? "--continue-without-fonts"
        : "--no-continue-without-fonts",
    );

    // Progress flag (inverted logic: noProgress=true means --no-progress)
    args.push(this.settings.noProgress ? "--no-progress" : "--progress");

    return [cmd, ...args];
  }

  async execute(): Promise<void> {
    const version = await this.getVersion();
    this.settings.metanormaVersion = version.toString();
    info(`Metanorma version: ${version}`);

    const cmdArray = this.getCompileCommand();
    info(`Executing: ${cmdArray.join(" ")}`);

    const workDir = this.settings.workspacePath;

    if (this.settings.useBundler) {
      await exec("bundle", ["exec", ...cmdArray], {
        cwd: workDir,
      });
    } else {
      await exec(cmdArray[0], cmdArray.slice(1), {
        cwd: workDir,
      });
    }

    // Export command and flags to GITHUB_ENV for debugging
    const cmd = this.getCommand();
    exportVariable("METANORMA_CMD", cmd);
    const flags = cmdArray.slice(1).join(" ");
    exportVariable("METANORMA_FLAGS", flags);
  }

  private getCommand(): string {
    const isWindows = process.platform === "win32";
    return isWindows ? "metanorma.exe" : "metanorma";
  }
}
