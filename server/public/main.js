const sockets = io();

sockets.on('response', function(data) {
let datos = document.getElementById('response');
console.log(data);
datos.innerHTML = `${data.data}`;
posdatos = 7;

for (i = 0; i < data.nCanales; i++) { 
   console.log('Datos en el Canal D' + i + ': ' + data.data.substring(posdatos,posdatos+4));
    posdatos = posdatos + 4;

 }

});

