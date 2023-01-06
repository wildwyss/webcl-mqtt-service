import {Client} from "../../mqtt/mqttClient.js"
import {toDeveloper, toProject} from "./jsonToModel.js";

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

  const client = Client(URL, port);
  const devTopic = "webcl/pep/dev";
  const projTopic = "webcl/pep/proj";
  client.subscribeToTopic(devTopic);
  client.subscribeToTopic(projTopic);

  const loadDevelopers = withDevelopers =>
    new Promise((resolve, reject) => {
      const sub = client.addListener(devTopic, restDevArray => {
        const devs = JSON.parse(restDevArray)
          .map(toDeveloper(imagePath));
        withDevelopers(devs);
        resolve(restDevArray);
        client.removeListener(sub);
      });
    });

  const loadProjects = withProjects =>
    new Promise((resolve, reject) => {
      const sub = client.addListener(projTopic, json => {
        withProjects(JSON.parse(json).map(toProject));
        resolve(json);
        client.removeListener(sub);
      });
    });

  const onDevAdded =  listener => client.addListener(devTopic,  listener);
  const onProjAdded = listener => client.addListener(projTopic, listener);

  return { loadDevelopers, loadProjects, onDevAdded, onProjAdded }
};