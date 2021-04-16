import React, { useState } from 'react';
import styles from './App.css';

function App() {
  // This is the data that we get from the badge. We use states to edit it.
  const [badgedata, setBadgedata] = useState("");

  const connectToDeviceAndSubscribeToUpdates = async () => {
    try {
      //Here we request a device which has the same name as the badges.
      const device = await navigator.bluetooth.requestDevice({
        filters: [{
          name: 'HDBDG'
        }],
        optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e',
          '00001800-0000-1000-8000-00805f9b34fb',
          '00001801-0000-1000-8000-00805f9b34fb']
      })
      await device.addEventListener('gattserverdisconnected', onDisconnected)
      //Then we continue to connect to it via GATT.
      const server = await device.gatt.connect();
      console.log('Device: ' + JSON.stringify(device));
      // Here we ask the server for badges' service. 
      const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e')
      // And here we ask the service for its characteristics --> notify -characteristics in this case. 
      const notifyC = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
      const writeC = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
      console.log(notifyC)
      console.log("Getting the characteristic");
      //const badgeVoiceData = await notifyC.readValue();
      //console.log(badgeVoiceData)
      await notifyC.addEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged,
        console.log("event listener in full action"));
      await notifyC.startNotifications();
      console.log('Notifications have been started.');
      
      //setBadgedata("töttöröö")

     // const data = Uint8Array.of(1);
     // console.log(data)
      // await writeC.writeValue(data)
      //console.log("We wrote something to WRITE characteristic. We cannot read it tho...")

      function onDisconnected() {
        console.log('Device is disconnected.');
      }

    }
    catch (error) {
      console.log(error)
    }
  }

  // This is a function which should convert the data types to values we could use in the front end.
  //This should be called when we add an event listener for future notifications.
  function handleCharacteristicValueChanged(event) {
    const badgeValue = event.target.value;
    console.log('Received ' + badgeValue);
    console.log('Hello')
    // This sets badge data to the data we get from badges.
    setBadgedata(badgeValue)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Hub
        </h2>
        <div className="buttonGroup">
          <button className="button" onClick={connectToDeviceAndSubscribeToUpdates}>Connect</button>
          <p>Badge data: {badgedata}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
