import React, { useState, useEffect } from 'react';
import styles from './App.css';

function App() {
  // This is the data that we get from the badge. We use states to edit it.
  const [badgedata, setBadgedata] = useState("");

  const connectToDeviceAndSubscribeToUpdates = async () => {
    //Here we request a device which has the same name as the badges.
    navigator.bluetooth.requestDevice({
      filters: [{
        name: 'HDBDG'
      }]
    })
    //Then we continue to connect to it via GATT.
      .then(device => {
        console.log('Device: ' + JSON.stringify(device))
       return device.gatt.connect()
        
  })
  // Here we ask the server for badges' service. 
.then(server => server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e'))
  // And here we ask the service for its characterics --> notify -characterics in this case. 
    .then(service => service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e'))
    .then(characteristic => {
      return characteristic.startNotifications()
    })
    // Here we want to add a event listener for notifications and start to get notified of data changes.
    .then(characteristic => {
      characteristic.addEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged);
      console.log('Notifications have been started.');
      console.log(characteristic)
    })
    .catch(error => { console.error(error); });
}

// This is a function which should convert the data types to values we could use in the front end.
function handleCharacteristicValueChanged(event) {
  const value = event.target.value;
  let a = [];
  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  for (let i = 0; i < value.byteLength; i++) {
    a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
  }
  console.log('> ' + a.join(' '));
  console.log('Received ' + value);
  // This should set badge data to data we get from badges.
  setBadgedata(value)
 }

return (
  <div className="App">
    <header className="App-header">
      <h2>
        Hub
        </h2>
      <div className="buttonGroup">
        <button className="button" onClick={connectToDeviceAndSubscribeToUpdates}>Connect</button>
        <p>Mysterious badge data: {badgedata}</p>
      </div>
    </header>
  </div>
);
}

export default App;
