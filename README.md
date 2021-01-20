# Setup Terraform Cloud

## Requirements
### Tools
- Docker
- NodeJS
- Typescript
- Act
### Environment
- Create Docker Hub variables :
  - `DOCKERHUB_USERNAME`
  - `DOCKERHUB_TOKEN`

## Usage
### Environment variables
Required environment variables have to be set to use this action :
- `TFC_WORKSPACE` (String): Terraform Cloud workspace ID.
- `TFC_API_TOKEN` (String): Terraform Cloud API token.
- `GCP_CREDENTIALS` (String): Google Cloud Platform JSON encoded credentials ([Link](https://cloud.google.com/docs/authentication/production))

The following variables are optionnal :
- `DEBUG` (Boolean): Add logging verbosity. __WARNING__ : It will display your credentials, uses it carefully !
