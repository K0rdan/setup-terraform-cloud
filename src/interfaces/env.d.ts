declare namespace NodeJS {
  // Interface for variables set in .env file
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    DEBUG: string | "false";
    // TERRAFORM CLOUD variables
    INPUTS_TFC_WORKSPACE: string;
    INPUTS_TFC_API_TOKEN: string;
    // GCP variables
    INPUTS_GCP_CREDENTIALS: string;
  }
}