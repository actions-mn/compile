import { info, setOutput } from "@actions/core";
import type { ICompileSettings } from "./compile-settings.js";
import { CompileCommandManager } from "./compile-command-manager.js";

export async function compileDocument(
  settings: ICompileSettings,
): Promise<void> {
  // Create command manager
  const commandManager = new CompileCommandManager(settings);

  // Execute compile
  await commandManager.execute();

  // Set outputs
  if (settings.metanormaVersion) {
    setOutput("metanorma-version", settings.metanormaVersion);
  }

  if (settings.outputDir) {
    setOutput("output-dir", settings.outputDir);
  }

  info("Metanorma compile completed successfully");
}
