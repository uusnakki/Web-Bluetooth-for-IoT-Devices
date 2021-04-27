import React, { useState } from 'react';
import styles from './App.css';
import struct from "./myStruct.js";


function App() {
  // This is the data that we get from the badge. We use states to edit it.
  const [badgedata, setBadgedata] = useState("");

  //TODO: should be swapped to constanly changing date time: now it is a constant
  const date = new Date();
  const currentTime = date.getTime();

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
      // Here we ask the server for badges' primary service for notifying and writing. 
      const primaryService = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e')
      //This service is for asking the device name for evey 5 seconds
      const secondaryService = await server.getPrimaryService('00001800-0000-1000-8000-00805f9b34fb')
      // And here we ask the service for its characteristics --> notify -characteristics in this case. 
      const notifyC = await primaryService.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
      // Here is a characterristic for asking the device's name
      const askName = await secondaryService.getCharacteristic('00002a00-0000-1000-8000-00805f9b34fb');
      const writeC = await primaryService.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
      console.log(notifyC)
      console.log("Getting the characteristic");
      //const badgeVoiceData = await notifyC.readValue();
      //console.log(badgeVoiceData)
      await notifyC.addEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged,
        console.log("Event listener in full action"));
      await notifyC.startNotifications();
      console.log('Notifications have been started.');
      const alertValue = await askName.readValue()
      //console.log(alertValue)

      // await window.setInterval(communicateWithBadge, 3000)

      //console.log(askName.readValue().getUint8(0))

      //setBadgedata("töttöröö")


      /*Here some random data for arraybuffer testing.
      This works! Now:
        - badge doesnt disconnect immediately after writing
        - event handler for notifying is activated
      */
       let s = struct('<cIIH')
       const bufferTest = new ArrayBuffer(s.size)
       console.log("s.size is " + s.size)
       console.log(bufferTest)
      // console.log(s.size)
       let jepa = s.pack("1", currentTime, currentTime, 5)
       console.log("this is jepa" + jepa)
       console.log(jepa)
       


     /* var bytes = ["r",currentTime];
      var unpacked = bytes.reduce(function (s, e) { 
        return s | e << ((2) * 8); 
      }, 0);
      console.log(unpacked); // 1700885369
      */

     /* 
      const buffer = new ArrayBuffer(3)
      const dataView = new DataView(buffer);
      console.log(buffer)
      dataView.setInt8(0, 256, unpacked)

      const data0 = dataView.getInt8(0)
      const data1 = dataView.getInt8(1)
      console.log("Date time in Epoch: " + currentTime)
      console.log(data0)
      console.log(data1)
      console.log(buffer)
      */

      // const data = new Uint8Array(buffer, currentTime)
      // console.log(data)
      await writeC.writeValue(jepa)
      console.log("We wrote something to WRITE characteristic. We cannot read it tho...")

      // This function is called when the badge disconnects from the application
      function onDisconnected() {
        console.log('Device is disconnected.');
      }

      // Here is a function to be called every 3 seconds to keep the connection up
      function communicateWithBadge() {
        console.log(alertValue.getUint8(0))
        console.log(currentTime)
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
    console.log(badgeValue)
    console.log('Hello, I am event handler. Nice to meet ya :-)')
    // This sets badge data to the data we get from badges.
    setBadgedata("badgeValue")
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