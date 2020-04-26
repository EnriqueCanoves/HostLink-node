//SERVIDOR WEB - INIT
const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = SocketIO.listen(server);

app.use(express.static(__dirname + '/public'));

server.listen(3000, function() {
    console.log('server listening on port', 3000);
})
//COMUNICACIÓN POR PUERTO SERIE
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('COM1', {
     baudRate: 9600,
     dataBits: 7,
     parity: ('even'),
     stopBits: 2,

 });
const parser = port.pipe (new Readline({ delimiter:  String.fromCharCode(13) }));
const args = process.argv.slice(2);
const cmdEnv = '@00RD000000'+ args[0];
console.log(cmdEnv);
//REALIZAMOS EL CÁLCULO DEL FCS
var L = cmdEnv.length;
var A = 0;
var TJ = 0;
var paso;
for (paso = 0; paso < L; paso++) {
    TJ = cmdEnv.substring(paso,paso+1);
    A = TJ.charAt().charCodeAt(0) ^ A;
};
FCS = A.toString(16);
FCS = FCS.toUpperCase();
// Abre el puerto de comunicaciones.
port.on("open", () => {
  console.log('Abriendo el puerto serie... \n');
  console.log('Código FCS ' + FCS);
});
// Tiempo de actualización de los canales de datos.
setTimeout(comunicar, 3000);
parser.on('data',RecuperarDatos);
// Función para comunicar con autómtata.
function comunicar () {
    port.write(cmdEnv + FCS +'*'+ String.fromCharCode(13), (err) => { 
        if (err) {
          return console.log('Error on write: ', err.message);
        }
        console.log('Comando Enviado con éxito!');
      });

    // parser.once('data',RecuperarDatos);
    
    }

    async function RecuperarDatos(data) {
       console.log(data);
         var  nCanales = cmdEnv.substring(11,13);
         var posdatos = 7;
         DatosArray = [];
        for (i = 0; i < nCanales; i++) {
            
            DatosArray.push(data.substring(posdatos,posdatos+4));
            
            console.log('Datos en el Canal D' + i + ': ' + data.substring(posdatos,posdatos+4));
            posdatos = posdatos + 4;
         }

         console.log(DatosArray);
       //Transmite los datos de repuesta hacia el socket abierto.
        io.emit('response', {data, nCanales});
             
         if (data) {
          setTimeout(comunicar,1000);
          
         }

}

