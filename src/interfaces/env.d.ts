declare namespace NodeJS {
  // Interface for variables set in .env file
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    DEBUG: string | "false";
    // TERRAFORM CLOUD variables
    TFC_WORKSPACE: string;
    TFC_API_TOKEN: string;
    // GCP variables
    GCP_CREDENTIALS: string;
  }
}