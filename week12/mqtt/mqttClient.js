import { Paho } from "./lib/paho-mqtt.js";

export { Client }

/**
 * Generates a new random clientId.
 * @returns { String }
 */
const generateClientId = () => "clientId_webcl" + Math.random() * 1000;

/**
 * A client to receive data from an MQTT broker.
 * @param  { !String } URL       - Uniform Resource Locator of the endpoint.
 * @param  { !Number } port      - The port, on which the broker is available.
 * @param  { !String } topic     - A topic under which the data are available
 * @param  { String }  protocol  - The protocol used for the communication. Default is "/mqtt".
 * @return { Promise<String> }   - If the request was successful a string containing the data, otherwise an error message
 * @constructor
 * @example
 * Client("broker.hivemq.com", 8000, "test")
 *    .then(  restDevArray => {
 *      restDevArray = JSON.parse(restDevArray.toString());
 *      const devs = restDevArray.map( toDeveloper(imagePath) );
 *      withDevelopers(devs);
 *    })
 *    .catch( err => console.error(err));
 */
const Client = (URL, port, topic, protocol = "/mqtt") =>

   new Promise((resolve, reject) => {
    const mqttClient = new Paho.MQTT.Client(URL, port, protocol, generateClientId());

    const onConnect = () => mqttClient.subscribe(topic);

    const onConnectionLost = responseObject => {
      // 0 is the ok error code
      if (0 !== responseObject.errorCode) {
        reject("Connection Lost");
      }
    };

    const onMessageArrived = message => resolve(message.payloadString);

    mqttClient.connect({onSuccess: onConnect});
    mqttClient.onConnectionLost = onConnectionLost;
    mqttClient.onMessageArrived = onMessageArrived;
  }
);