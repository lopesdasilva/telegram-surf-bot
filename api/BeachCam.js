const fetch = require('node-fetch');

const IMPA_REPORT_REQUEST = 'https://beachcam.meo.pt/umbraco/App/BeachCam/IpmaReport?beachId=';
const FULL_LIST_URL = 'https://beachcam.meo.pt/umbraco/App/BeachCam/GetLiveCamsV2';


const getIMPAReportRequest = async (id) => fetch(`${IMPA_REPORT_REQUEST}${id}`)
  .then((response) => response.json());


const getFullList = async () => fetch(FULL_LIST_URL)
  .then((response) => response.json());


exports.getIMPAReportRequest = getIMPAReportRequest;
exports.getFullList = getFullList;
