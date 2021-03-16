import React, { useState, useEffect } from 'react';
import styles from './App.css';

function App() {
  // This is the data that we get from the badge. We use states to edit it.
  const [badgedata, setBadgedata] = useState(null);

  const connectToDeviceAndSubscribeToUpdates = async () => {
    const device = await navigator.bluetooth
      .requestDevice({
        acceptAllDevices: true,
        // This is the device's UUID (?)
        optionalServices: ['0000180f-0000-1000-8000-00805f9b34fb']
      });
   const server = await device.gatt.connect();

   const service = await server.getPrimaryService('0000180f-0000-1000-8000-00805f9b34fb');

      // Here should be some kind of service, trying to find it....
   const characteristic = await service.getCharacteristic('battery_level');
   
   const reading = await characteristic.readValue();
   console.log(reading.getUint8(0) + '%');
   
    // Shows the badge data. Or should show
    setBadgedata(reading.getUint8(0) + '%');
  
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Hub
        </h2>
        <div className="buttonGroup">
          <button className="button" onClick={connectToDeviceAndSubscribeToUpdates}>Connect</button>
          <button className="button2">Disconnect</button>
          <p>Mysterious badge data: {badgedata}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
