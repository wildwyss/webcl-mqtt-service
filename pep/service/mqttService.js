import { Client }                 from "../../mqtt/mqttClient.js"
import { toProject, toDeveloper } from "./jsonToModel.js";

export { pepServices }


/**
 * Concrete factory for remote, asynchronous {@link PepService} functions.
 *
 * @param { !String } URL
 * @param { !Number } port
 * @param { !String } imagePath
 * @return { PepService }
 */
const pepServices = (URL, port, imagePath) => {

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