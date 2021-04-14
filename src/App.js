import React, { useState, useEffect } from 'react';
import styles from './App.css';

function App() {
  // This is the data that we get from the badge. We use states to edit it.
  const [badgedata, setBadgedata] = useState("");

  const connectToDeviceAndSubscribeToUpdates = async () =>{
    //Here we request a device which has the same name as the badges.
    const device = await navigator.bluetooth.requestDevice({
      filters: [{
        name: 'HDBDG'
      }],
      optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e',
        '00001800-0000-1000-8000-00805f9b34fb',
        '00001801-0000-1000-8000-00805f9b34fb']
    })
      //Then we continue to connect to it via GATT.
      const server = await device.gatt.connect();
      console.log('Device: ' + JSON.stringify(device));
      // Here we ask the server for badges' service. 
      const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e')
      // And here we ask the service for its characterics --> notify -characterics in this case. 
      const notifyC = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
      const writeC = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
      console.log("Getting the characteristic");
        
      await notifyC.startNotifications();
      await notifyC.addEventListener('characteristicvaluechanged',
          handleCharacteristicValueChanged);
      console.log('Notifications have been started.');
      const data = new Uint8Array([0x55, 0x70])
      console.log(data)
      const writtenValue = await writeC.writeValue(data)
      console.log(writtenValue)
      setBadgedata(writtenValue)
      const descriptor = await notifyC.getDescriptor('00002902-0000-1000-8000-00805f9b34fb');
      
      const descValue = await descriptor.readValue();
      console.log(descValue);
      const decoder =  new TextDecoder('utf-8');
      console.log(`User Description: ${decoder.decode(descValue)}`);
     
  }

// This is a function which should convert the data types to values we could use in the front end.
//This should be called when we add an event listener for future notifications.
function handleCharacteristicValueChanged(event) {
  const badgeValue = event.target.value.getUint8(0);
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
