# Setup Terraform Cloud

## Requirements
### Tools
- Docker
- NodeJS
- Typescript
- Act
### Environment
- Create a Terraform Cloud Workspace
- Create a user API token
- Create a GCP credentials variables with :
  - `GOOGLE_CREDENTIALS` key
  - `sensitive` property checked

## Usage
### Environment variables
Required environment variables have to be set to use this action :
- `TFC_WORKSPACE` (String): Terraform Cloud workspace ID.
- `TFC_API_TOKEN` (String): Terraform Cloud API token.
- `GCP_CREDENTIALS` (String): Google Cloud Platform JSON encoded credentials ([Link](https://cloud.google.com/docs/authentication/production))

The following variables are optionnal :
- `DEBUG` (Boolean): Add logging verbosity. __WARNING__ : It will display your credentials, uses it carefully !
