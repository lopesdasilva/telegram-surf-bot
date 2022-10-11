import fetch from 'node-fetch';

const IPMA_REPORT_REQUEST = 'https://beachcam.meo.pt/umbraco/App/BeachCam/IpmaReport?beachId=';
const FULL_LIST_URL = 'https://beachcam.meo.pt/umbraco/App/BeachCam/GetLiveCamsV2';

export const getIMPAReportRequest = async (id) => fetch(`${IPMA_REPORT_REQUEST}${id}`)
  .then((response) => response.json());

export const getFullList = async () => fetch(FULL_LIST_URL)
  .then((response) => response.json());
