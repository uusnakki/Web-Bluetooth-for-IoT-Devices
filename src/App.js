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
      }],
      optionalServices: ['00001800-0000-1000-8000-00805f9b34fb']
    })
    //Then we continue to connect to it via GATT.
      .then(device => {
        console.log('Device: ' + JSON.stringify(device))
       return device.gatt.connect()
        
  })
  // Here we ask the server for badges' service. 
.then(server => server.getPrimaryService('00001800-0000-1000-8000-00805f9b34fb'))
  // And here we ask the service for its characterics --> notify -characterics in this case. 
    .then(service => {
      console.log("Getting the characteristic")
      return service.getCharacteristic('00002a01-0000-1000-8000-00805f9b34fb')
    })
    .then(characteristic => {
      console.log(characteristic)
      characteristic.addEventListener('characteristicvaluechanged',
      handleCharacteristicValueChanged)
      return characteristic.readValue()
    })
}

// This is a function which should convert the data types to values we could use in the front end.
//This should be called when we add an event listener for future notifications.
function handleCharacteristicValueChanged(event) {
  const badgeValue = event.target.value.getUint8(1);
  console.log('Received ' + badgeValue);
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
