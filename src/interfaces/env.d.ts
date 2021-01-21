declare namespace NodeJS {
  // Interface for variables set in .env file
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    DEBUG: string | "false";
    // TERRAFORM CLOUD variables
    INPUT_TFC_WORKSPACE: string;
    INPUT_TFC_API_TOKEN: string;
    // GCP variables
    INPUT_GCP_CREDENTIALS: string;
  }
}