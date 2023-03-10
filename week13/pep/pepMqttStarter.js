import { pepServices } from "./service/mqttService.js";
import { start }       from "./pep.js";

export { imagePath }

// use data as provided from view through the window object:
const URL       = "broker.hivemq.com";
const port      = 8000;
const imagePath = "/webcl-mqtt-service/week13/pep/";
const appRootId = window.appRootId;

const service = pepServices(URL, port, imagePath);

service.loadDevelopers( devs =>
    service.loadProjects( projects =>
      start(appRootId, devs, projects, service)
));