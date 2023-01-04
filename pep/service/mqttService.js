import { Client }                 from "../../mqtt/mqttClient.js"
import { toProject, toDeveloper } from "./jsonToModel.js";

export { pepServices }

const pepServices = (URL, port, imagePath) => {

 // '[{"id":0,"color":"red","name":"Personal Einsatz Planung"},{"id":1,"color":"green","name":"Web Clients"}]'
//'[{"id":0,"img":"img/img0.jpg","name":"Marie-Claude Federspiel"},{"id":1,"img":"img/img1.jpg","name":"Christian Ribeaud"}]'

  const loadDevelopers = withDevelopers => {
    Client(URL, port, "webcl/pep/dev")
        .then(  restDevArray => {
          restDevArray = JSON.parse(restDevArray.toString()); // TODO check if that is really needed
          const devs = restDevArray.map( toDeveloper(imagePath) );
          withDevelopers(devs);
        })
        .catch( err => console.error(err));
  };

  const  loadProjects = withProjects => {
    Client(URL, port, "webcl/pep/proj")
        .then(json => {
          json = JSON.parse(json.toString());
          withProjects(json.map(toProject))
        })
        .catch( err => console.error(err));
  };

  return { loadDevelopers, loadProjects }
};