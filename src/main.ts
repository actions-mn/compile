import { setFailed, setOutput } from "@actions/core";
import { getInputs } from "./input-helper.js";
import { compileDocument } from "./compile-provider.js";

async function run(): Promise<void> {
  try {
    // Get inputs
    const settings = await getInputs();

    // Execute metanorma compile
    await compileDocument(settings);

    // Set outputs
    setOutput("output-dir", settings.outputDir);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setFailed(`Metanorma compile failed: ${message}`);
  }
}

// Run the main function
run();
