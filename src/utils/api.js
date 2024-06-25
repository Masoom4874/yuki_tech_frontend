const domain = "https://apexapi.progreet.app";
// const domain = "http://localhost:3000";

// Hello;
const endpoints = {
  checkEmp: "/yuki/check-emp",
  getEmpData: "/yuki/get-emp-data",
  createCert: "/yuki/create-cert",
};
function getURLbyEndPoint(endpoint) {
  return domain + "/api/v1" + endpoints[endpoint];
}

export { domain, endpoints, getURLbyEndPoint };
