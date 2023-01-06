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

  const loadDevelopers = withDevelopers =>
      Client(URL, port, "webcl/pep/dev")
          .then(restDevArray => {
            const devs = JSON.parse(restDevArray)
                .map(toDeveloper(imagePath));
            withDevelopers(devs);
          })
          .catch(err => console.error(err));

  const loadProjects = withProjects =>
      Client(URL, port, "webcl/pep/proj")
          .then(json =>
              withProjects(JSON.parse(json).map(toProject))
          )
          .catch(err => console.error(err));

  return { loadDevelopers, loadProjects }
};