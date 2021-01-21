import fetch, { Headers, RequestInfo, RequestInit } from 'node-fetch';
import * as core from '@actions/core';

import type { TFC_VARIABLES, TFC_VARIABLES_RESULT } from 'interfaces';

const { DEBUG, INPUT_TFC_WORKSPACE, INPUT_TFC_API_TOKEN, INPUT_GCP_CREDENTIALS } = process.env;

if (!INPUT_TFC_WORKSPACE ||  !INPUT_TFC_API_TOKEN) {
  core.startGroup(
    '[Setup-TFC] Configuration error, missing Terraform Cloud variables',
  );
  if (DEBUG === 'true') {
    core.debug(`- TFC_WORKSPACE = '${INPUT_TFC_WORKSPACE}'`);
    core.debug(`- TFC_API_TOKEN = '${INPUT_TFC_API_TOKEN}'`);
  }
  core.endGroup();
  process.exit(-1);
} else if (!INPUT_GCP_CREDENTIALS) {
  core.startGroup('[Setup-TFC] Configuration error, missing Google Cloud Platform variables');
  if (DEBUG === 'true') {
    core.debug(`- GCP_CREDENTIALS = '${INPUT_GCP_CREDENTIALS}'`);
  }
  core.endGroup();
  process.exit(-1);
} else {
  core.startGroup('[Setup-TFC] All requirements are OK');
  if (DEBUG === 'true') {
    core.debug(`- TF_WORKSPACE = '${INPUT_TFC_WORKSPACE}'`);
    core.debug(`- TF_API_TOKEN = '${INPUT_TFC_API_TOKEN}'`);
    core.debug(`- GCP_CREDENTIALS = '${INPUT_GCP_CREDENTIALS}'`);
  }
  core.endGroup();
}

const tfc_url: RequestInfo = `https://app.terraform.io/api/v2/workspaces/${INPUT_TFC_WORKSPACE}/vars`;
const tfc_headers: Headers = new Headers();
tfc_headers.append("Content-Type", "application/vnd.api+json");
tfc_headers.append("Authorization", `Bearer ${INPUT_TFC_API_TOKEN}`);

const getTFCVariables: TFC_VARIABLES = async (): Promise<TFC_VARIABLES_RESULT> => {
  core.startGroup('[Setup-TFC] Getting Terraform Cloud variables...');
  const tfc_options: RequestInit = {
    method: 'GET',
    headers: tfc_headers,
  };

  const response = await fetch(tfc_url, tfc_options);
  const responseJSON = await response.json();

  const GOOGLE_CREDENTIALS = responseJSON?.data?.find((vars: any) => vars?.attributes?.key === "GOOGLE_CREDENTIALS")?.id;
  if (DEBUG === 'true') {
    core.debug(`- GOOGLE_CREDENTIALS = ${GOOGLE_CREDENTIALS}`);
  }
  core.endGroup();
  return {
    GOOGLE_CREDENTIALS,
  };
};

const updateTFCVariable = async (varId: String) => {
  core.startGroup('[Setup-TFC] Updating Terraform Cloud "GOOGLE_CREDENTIALS" variable...');
  const tfc_options: RequestInit = {
    method: 'PATCH',
    headers: tfc_headers,
    body: JSON.stringify({
      data: {
        type: "vars",
        id: varId,
        attributes: {
          key: "GOOGLE_CREDENTIALS",
          value: INPUT_GCP_CREDENTIALS,
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
    core.debug(responseJSON);
  }
  core.endGroup();
  return responseJSON;
};

const setupTFC = async () => {
  try {
    const { GOOGLE_CREDENTIALS } = await getTFCVariables();
    if (GOOGLE_CREDENTIALS) {
      await updateTFCVariable(GOOGLE_CREDENTIALS);
    }
  }
  catch(err) {
    core.startGroup(`[Setup-TFC] Error when getting TFC variables.`);
    core.error(err);
    core.endGroup();
  }
};

setupTFC();