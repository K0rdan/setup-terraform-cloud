import fetch, { Headers, RequestInfo, RequestInit } from 'node-fetch';
import type { TFC_VARIABLES, TFC_VARIABLES_RESULT } from 'interfaces';

const { DEBUG, TFC_WORKSPACE, TFC_API_TOKEN, GCP_CREDENTIALS } = process.env;

if (!TFC_WORKSPACE ||  !TFC_API_TOKEN) {
  console.group(
    '[Setup-TFC] Configuration error, missing Terraform Cloud variables',
  );
  if (DEBUG === 'true') {
    console.error(`- TF_WORKSPACE = '${TFC_WORKSPACE}'`);
    console.error(`- TF_API_TOKEN = '${TFC_API_TOKEN}'`);
  }
  console.groupEnd();
  process.exit(-1);
} else if (!GCP_CREDENTIALS) {
  console.group('[Setup-TFC] Configuration error, missing Google Cloud Platform variables');
  if (DEBUG === 'true') {
    console.error(`- GCP_CREDENTIALS = '${GCP_CREDENTIALS}'`);
  }
  console.groupEnd();
  process.exit(-1);
} else {
  console.group('[Setup-TFC] All requirements are OK');
  if (DEBUG === 'true') {
    console.debug(`- TF_WORKSPACE = '${TFC_WORKSPACE}'`);
    console.debug(`- TF_API_TOKEN = '${TFC_API_TOKEN}'`);
    console.debug(`- GCP_CREDENTIALS = '${GCP_CREDENTIALS}'`);
  }
  console.groupEnd();
}

const tfc_url: RequestInfo = `https://app.terraform.io/api/v2/workspaces/${TFC_WORKSPACE}/vars`;
const tfc_headers: Headers = new Headers();
tfc_headers.append("Content-Type", "application/vnd.api+json");
tfc_headers.append("Authorization", `Bearer ${TFC_API_TOKEN}`);

const getTFCVariables: TFC_VARIABLES = async (): Promise<TFC_VARIABLES_RESULT> => {
  console.group('[Setup-TFC] Getting Terraform Cloud variables...');
  const tfc_options: RequestInit = {
    method: 'GET',
    headers: tfc_headers,
  };

  const response = await fetch(tfc_url, tfc_options);
  const responseJSON = await response.json();

  const GOOGLE_CREDENTIALS = responseJSON?.data?.find((vars: any) => vars?.attributes?.key === "GOOGLE_CREDENTIALS")?.id;
  if (DEBUG === 'true') {
    console.debug(`- GOOGLE_CREDENTIALS = ${GOOGLE_CREDENTIALS}`);
  }
  console.groupEnd();
  return {
    GOOGLE_CREDENTIALS,
  };
};

const updateTFCVariable = async (varId: String) => {
  console.group('[Setup-TFC] Updating Terraform Cloud "GOOGLE_CREDENTIALS" variable...');
  const tfc_options: RequestInit = {
    method: 'PATCH',
    headers: tfc_headers,
    body: JSON.stringify({
      data: {
        type: "vars",
        id: varId,
        attributes: {
          key: "GOOGLE_CREDENTIALS",
          value: GCP_CREDENTIALS,
          description: "GCP credential associated to a specific project",
          category: "env",
          hcl: false,
          sensitive: false,
        }
      }
    }),
  };

  const response = await fetch(`${tfc_url}/${varId}`, tfc_options);
  const responseJSON = await response.json();

  if (DEBUG === 'true') {
    console.debug('Response', responseJSON);
  }
  console.groupEnd();
};

const setupTFC = async () => {
  try {
    const { GOOGLE_CREDENTIALS } = await getTFCVariables();

    if (GOOGLE_CREDENTIALS) {
      await updateTFCVariable(GOOGLE_CREDENTIALS);
    }
  }
  catch(err) {
    console.group(`[Setup-TFC] Error when getting TFC variables.`);
    console.error(err);
    console.groupEnd();
  }
};

setupTFC();