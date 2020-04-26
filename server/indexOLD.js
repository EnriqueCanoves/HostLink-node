const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;
const parser = new ReadLine();

const mySerial = new SerialPort('COM3', {
    baudRate: 9600,
    dataBits: 7,
    parity: 'even',
    stopBits: 2,

});
var CRS = String.fromCharCode(13);

mySerial.on('open', function (){
    console.log('Puerto abierto COM3');
    mySerial.write("@00SC0353*\n");
});
mySerial.on('data', function(){
   
    console.log(data.toString());
});