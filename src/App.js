import React, { useState, useEffect } from 'react';
import styles from './App.css';
import struct from "./myStruct.js";


function App() {
  // This is the data that we get from the badge. We use states to edit it.
  const [badgedata, setBadgedata] = useState("");
  const screenTime = new Date().toLocaleTimeString();
  const date = new Date();
  const [time, setTime] = useState(screenTime);

  //TODO: should be swapped to constanly changing date time: now it is a constant
  const currentTime = date.getTime();

  function updateClock() {
    const screenTime = new Date().toLocaleTimeString();
    setTime(screenTime)
  }

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    window.setInterval(updateClock, 1000)
  });

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
      //const secondaryService = await server.getPrimaryService('00001800-0000-1000-8000-00805f9b34fb')

      // And here we ask the service for its characteristics --> notify -characteristics in this case. 
      const notifyC = await primaryService.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');

      // Here is a characterristic for asking the device's name
      //const askName = await secondaryService.getCharacteristic('00002a00-0000-1000-8000-00805f9b34fb');

      // Here is a characteristics for writing values to the badge and
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
      //const alertValue = await askName.readValue()
      //console.log(alertValue)
      await sendStartRecRequest()
      await window.setInterval(communicateWithBadge, 3000)



      /*  sends request to start recording, with specified timeout
       (if after timeout minutes badge has not seen server, it will stop recording)
         sendStartRecRequest: badge.py line 441
      This works! Now:
        - badge doesnt disconnect immediately after writing
        - event handler for notifying is activated
      */
      function sendStartRecRequest() {
        let s = struct('<cIHH')
        const buffer = new ArrayBuffer(s.size)
        console.log("s.size is " + s.size)
        console.log(buffer)
        // console.log(s.size)
        let recRequest = s.pack("1", currentTime, currentTime, 3)
        console.log("this is recRequest" + recRequest)
        console.log(recRequest)
        writeC.writeValue(recRequest)
      }


      /* send request for data since given date
        Note - date is given in UTC epoch
         sendDataRequest: badge.py line 466
      This works! Now:
        - badge doesnt disconnect immediately after writing
        - event handler for notifying is activated
      */
      function sendDataRequest() {
        let s = struct('<cIH')
        const bufferTest = new ArrayBuffer(s.size)
        console.log("s2.size is " + s.size)
        console.log(bufferTest)
        // console.log(s.size)
        let dataRequest = s.pack("r", currentTime, currentTime)
        console.log("this is dataRequest" + dataRequest)
        console.log(dataRequest)
        writeC.writeValue(dataRequest)
      }


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


      // This function is called when the badge disconnects from the application
      function onDisconnected() {
        console.log('Device is disconnected.');
      }

      // Here is a function to be called every 3 seconds to keep the connection up
      function communicateWithBadge() {
        console.log(date)
        console.log(currentTime)
        sendDataRequest()
        console.log("We wrote something to WRITE characteristic. We cannot read it tho...")
      }

    }
    catch (error) {
      console.log(error)
    }
  }


  //This function disconnects one badge
  function disconnectBadge() {
    console.log("disconnect")
  }
  // This is a function which should convert the data types to values we could use in the front end.
  //This should be called when we add an event listener for future notifications.
  function handleCharacteristicValueChanged(event) {
    const badgeValue = event.target.value;
    console.log('Received ' + badgeValue);
    console.log(badgeValue)
    console.log('Hello, I am event handler. Nice to meet ya :-)')
    // This sets badge data to the data we get from badges.
    setBadgedata(badgeValue.getUint8(1))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Hub
        </h2>
        <h4>Time <br /> {time}</h4>
        <div>

        </div>
        <div className="buttonGroup">
          <button className="button" onClick={connectToDeviceAndSubscribeToUpdates}>Connect</button>
          <button className="button2" onClick={disconnectBadge}>Disconnect</button>
          <p>Badge data: {badgedata}</p>
        </div>
      </header>
    </div>
  );
}

export default App;