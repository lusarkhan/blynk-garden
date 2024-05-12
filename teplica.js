/*
*

GPIO 4 - DHT22 БОЛЬШАЯ DATA (ЗЕЛЕНЫЙ)
PIN 2  - DHT22 БОЛЬШАЯ +5В  (КОРИЧНЕВЫЙ)
PIN 6  - DHT22 БОЛЬШАЯ GND  (СИНИЙ)

GPIO 17 - DHT22 СРЕДНЯЯ DATA (ЗЕЛЕНЫЙ)
PIN 4  - DHT22 СРЕДНЯЯ +5В  (ОРАНЖЕВЫЙ)
PIN 9  - DHT22 СРЕДНЯЯ GND  (ЖЕЛТЫЙ)

GPIO 27 - DHT22 ГАРАЖ DATA   (СИРЕНЕВЫЙ)
PIN  

РЕЛЕ К1 - Вентиляция БОЛЬШАЯ
РЕЛЕ К2 - Вентиляция СРЕДНЯЯ
РЕЛЕ К3 - ОСВЕЩЕНИЕ БОЛЬШАЯ
РЕЛЕ К4 - ОСВЕЩЕНИЕ СРЕДНЯЯ
РЕЛЕ К5 - ОКНО БОЛЬШАЯ
РЕЛЕ К6 - ОКНО БОЛЬШАЯ
РЕЛЕ К7 - ОКНО СРЕДНЯЯ
РЕЛЕ К8 - ОКНО СРЕДНЯЯ

*/
const process=require('process');

var Blynk = require('blynk-library');

var sensorLib = require("node-dht-sensor").promises;

var Gpio = require('onoff').Gpio;

var AUTH = '';

var blynk = new Blynk.Blynk(AUTH, { connector : new Blynk.TcpClient(   { addr:"", port:8080 } ) });

blynk.syncAll();
// DHT22 БОЛЬШАЯ
var dht_sensor_pin_big = 4
// DHT22 СРЕДНЯЯ
var dht_sensor_pin_sred = 17
// DHT22 ГАРАЖ
var dht_sensor_pin_garage = 27

var T_COLOR = '#f5b041';
var H_COLOR = '#85c1e9';
var ERR_COLOR = '#444444';

//Current Date
let date_ob = new Date();

let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

// prints date in YYYY-MM-DD format
console.log(year + "-" + month + "-" + date);

// prints date & time in YYYY-MM-DD HH:MM:SS format
console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

// prints time in HH:MM format
console.log(hours + ":" + minutes);

// V_PINS
// BOLSHAYA TEPLICA TEMP and HUM
var V_PIN_T_BIG = new blynk.VirtualPin(0);
var V_PIN_H_BIG = new blynk.VirtualPin(1);

//# SREDNYAYA TEPLICA
var V_PIN_T_SRED = new blynk.VirtualPin(2);
var V_PIN_H_SRED = new blynk.VirtualPin(3);

//# GARAGE
var V_PIN_T_GARAGE = new blynk.VirtualPin(4);
var V_PIN_H_GARAGE = new blynk.VirtualPin(5);

//RELAY V_PINS
var V_PIN_RELAY1 = new blynk.VirtualPin(6);
var V_PIN_RELAY2 = new blynk.VirtualPin(7);
var V_PIN_RELAY3 = new blynk.VirtualPin(8);
var V_PIN_RELAY4 = new blynk.VirtualPin(9);
var V_PIN_RELAY5 = new blynk.VirtualPin(10);
var V_PIN_RELAY6 = new blynk.VirtualPin(11);
var V_PIN_RELAY7 = new blynk.VirtualPin(12);
var V_PIN_RELAY8 = new blynk.VirtualPin(13);

//OTHER V_PINS
var V_PIN_14_RPI_REBOOT = new blynk.VirtualPin(14);

const relays = [
  new Gpio(21, 'out'),  //Вентиляция БОЛЬШАЯ
  new Gpio(20, 'out'),  //Вентиляция СРЕДНЯЯ
  new Gpio(16, 'out'),  //ОСВЕЩЕНИЕ БОЛЬШАЯ
  new Gpio(12, 'out'),  //ОСВЕЩЕНИЕ СРЕДНЯЯ
  new Gpio(6, 'out'),   //ОКНО БОЛЬШАЯ
  new Gpio(13, 'out'),  //ОКНО БОЛЬШАЯ
  new Gpio(19, 'out'),  //ОКНО СРЕДНЯЯ
  new Gpio(26, 'out')   //ОКНО СРЕДНЯЯ
];

const allRelaysOff = () => {
  relays.forEach(relay => relay.writeSync(1));
};


allRelaysOff();

async function exec() {
  try {
    	if (!sensorLib.initialize(22, 4)){
    	    console.warn('BIG Failed to initialize sensor');
            blynk.setProperty(0, 'color', ERR_COLOR);
            blynk.setProperty(1, 'color', ERR_COLOR);
    	} else if (!sensorLib.initialize(22, 17)) {
            console.warn('SRED Failed to initialize sensor');
            blynk.set_property(2, 'color', ERR_COLOR);
            blynk.set_property(3, 'color', ERR_COLOR);
        } else if (!sensorLib.initialize(22, 27)) {
            console.warn('GARAGE Failed to initialize sensor');
            blynk.set_property(4, 'color', ERR_COLOR);
            blynk.set_property(5, 'color', ERR_COLOR);
        }

    	const resBig = await sensorLib.read(22, 4);
    	const resSred = await sensorLib.read(22, 17);

      blynk.virtualWrite(0, resBig.temperature.toFixed(1));
    	blynk.virtualWrite(1, resBig.humidity.toFixed(1));
      blynk.setProperty(0,'color', T_COLOR);
      blynk.setProperty(1,'color', H_COLOR);

    	blynk.virtualWrite(2, resSred.temperature.toFixed(1));
    	blynk.virtualWrite(3, resSred.humidity.toFixed(1));
      blynk.setProperty(2,'color', T_COLOR);
      blynk.setProperty(3,'color', H_COLOR);

      blynk.virtualWrite(15, date + "-" + month + "-" + year);
      blynk.virtualWrite(16, hours + ":" + minutes);
  } catch (err) {
    console.error("Failed to read sensor data:", err);
  }
}

setInterval(function() {
      exec();
}, 1000);


V_PIN_RELAY1.on('write', function(param) {
      if (param[0] =='0') {
          relays[0].writeSync(0);
      } else {
          relays[0].writeSync(1);
      }
      console.log('V6: ', param[0]);
});

V_PIN_RELAY2.on('write', function(param) {
      if (param[0] =='0') {
          relays[1].writeSync(0);
      } else {
          relays[1].writeSync(1);
      }
          console.log('V7: ', param[0]);
});

V_PIN_RELAY3.on('write', function(param) {
      if (param[0] =='0') {
          relays[2].writeSync(0);
      } else {
          relays[2].writeSync(1);
      }
          console.log('V8: ', param[0]);
});

V_PIN_RELAY4.on('write', function(param) {
      if (param[0] =='0') {
          relays[3].writeSync(0);
      } else {
          relays[3].writeSync(1);
      }
          console.log('V9: ', param[0]);
});
//Открытие окна в БОЛЬШОЙ
V_PIN_RELAY5.on('write', function(param) {
      if (param[0] =='0') {
          relays[4].writeSync(0);
      } else {
          relays[4].writeSync(1);
      }
          console.log('V10: ', param[0]);
});
//Закрытие окна в БОЛЬШОЙ
V_PIN_RELAY6.on('write', function(param) {
      if (param[0] =='0') {
          relays[5].writeSync(0);
      } else {
          relays[5].writeSync(1);
      }
          console.log('V11: ', param[0]);
});
//Открытие окна в СРЕДНЕЙ
V_PIN_RELAY7.on('write', function(param) {
      if (param[0] =='0') {
          relays[6].writeSync(0);
      } else {
          relays[6].writeSync(1);
      }
          console.log('V12: ', param[0]);
});
//Закрытие окна в СРЕДНЕЙ
V_PIN_RELAY8.on('write', function(param) {
      if (param[0] =='0') {
          relays[7].writeSync(0);
      } else {
          relays[7].writeSync(1);
      }
          console.log('V13: ', param[0]);
});

// ----- RPi Reboot Command -----
V_PIN_14_RPI_REBOOT.on('write', function(param) {  
      if (param[0] == '0') { 
         allRelaysOff();
         process.exec('sudo /sbin/shutdown -r', function (msg) { console.log(msg) });
      }
});

blynk.on('connect', function() {
   console.log("Blynk ready."); 
   blynk.syncVirtual(6);  //Синхронизация V6 Вентиляция БОЛЬШАЯ
   blynk.syncVirtual(7);  //Синхронизация V7 Вентиляция СРЕДНЯЯ
   blynk.syncVirtual(8);  //Синхронизация V8 Освещение БОЛЬШАЯ
   blynk.syncVirtual(9);  //Синхронизация V9 Освещение СРЕДНЯЯ
   //blynk.sendInternal("rtc", "sync");
});


blynk.on('disconnect', function() { console.log("DISCONNECT"); });

process.on('SIGINT', () => {
  allRelaysOff();
  process.exit();
});


process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) allRelaysOff();
    if (options.exit){
        allRelaysOff();
        process.exit();
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
