export interface ICompileSettings {
  // Required inputs
  inputFile: string;
  type: string;

  // Optional inputs with defaults
  extensions: string;
  format: string;
  require: string;
  wrapper: boolean;
  asciimath: boolean;
  datauriimage: boolean;
  relaton: string;
  extract: string;
  outputDir: string;
  agreeToTerms: boolean;
  installFonts: boolean;
  continueWithoutFonts: boolean;
  noProgress: boolean;
  useBundler: boolean;

  // Computed values
  metanormaVersion?: string;
  workspacePath: string;
}
