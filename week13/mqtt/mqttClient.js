import { Paho } from "./lib/paho-mqtt.js";

export { Client }

/**
 * Generates a new random clientId.
 * @returns {string}
 */
const generateClientId = () => "clientId_webcl" + Math.random() * 1000;

/**
 * A client to receive data from an MQTT broker.
 * @param  { !String } URL       - Uniform Resource Locator of the endpoint.
 * @param  { !Number } port      - The port, on which the broker is available.
 * @param  { String }  protocol  - The protocol used for the communication. Default is "/mqtt".
 * @return { Promise<String> }   - If the request was successful a string containing the data, otherwise an error message
 * @constructor
 *
 */
const Client = (URL, port, protocol = "/mqtt") =>{
  let connected = false;
  const allListeners = [];
  const topics = [];
  const mqttClient = new Paho.MQTT.Client(URL, port, protocol, generateClientId());

  mqttClient.connect({onSuccess:() => onConnect()});
  const onConnect = () => {
      connected = true;
      topics.forEach(mqttClient.subscribe)
    };

    const onConnectionLost = responseObject => {
      // 0 is the ok error code
      if (0 !== responseObject.errorCode) {
        console.log("Connection Lost");
        console.log(responseObject);
      }
    };

    const subscribeToTopic = topic => {
      topics.push(topic);
      if (connected) {
        if (!topics.includes(topic)) {
          mqttClient.subscribe(topic);
        }
      }
    };

    const removeListener = listener => {
      const index = allListeners.indexOf(listener);
      if (index > -1) {
        allListeners.splice(index, 1);
      }
    };

    const addListener = (topic, callback) => {
      const listener = { topic, callback};
      allListeners.push(listener);
      return listener;
    };

    const onMessageArrived = message =>
      allListeners
        .filter(({topic}) => message.topic === topic)
        .forEach(({callback}) => callback(message.payloadString));

    mqttClient.onConnectionLost = onConnectionLost;
    mqttClient.onMessageArrived = onMessageArrived;

    return {
      subscribeToTopic,
      removeListener,
      addListener
    }
};