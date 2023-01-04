import { Paho } from "./lib/paho-mqtt.js";

export { Client }

const Client = (URL, port, topic) =>

   new Promise((resolve, reject) => {

    const mqttClient = new Paho.MQTT.Client(URL, port, "/mqtt", "clientId_" + Math.random() * 100);

    //mqttClient.startTrace();

    const onConnect = () => mqttClient.subscribe(topic);

    const onConnectionLost = responseObject => {
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