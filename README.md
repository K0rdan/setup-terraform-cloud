# Setup Terraform Cloud
## Requirements
### Local tools
- Docker >= 20.10.2
- NodeJS >= 12.6
- Act >= 0.2.18
### GitHub Environment
- Create Docker Hub variables :
  - `DOCKERHUB_USERNAME` (String): Docker Hub user to store generated image.
  - `DOCKERHUB_TOKEN` (String): Docker Hub API token associated to the account you want to use to store the generated image.

## Usage
### Environment variables / GitHub Inputs
Required environment variables have to be set to use this action :
- `TFC_WORKSPACE` (String): Terraform Cloud workspace ID.
- `TFC_API_TOKEN` (String): Terraform Cloud API token.
- `GCP_CREDENTIALS` (String): Google Cloud Platform JSON encoded credentials ([Link](https://cloud.google.com/docs/authentication/production))

The following variables are optionnal :
- `DEBUG` (Boolean): Add logging verbosity. __WARNING__ : It will display your credentials, uses it carefully !
