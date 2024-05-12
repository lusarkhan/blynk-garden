// МАЛИНА УПРАВЛЕНИЕ

const process=require('process');

var Blynk = require('blynk-library');

var AUTH = '';

var blynk = new Blynk.Blynk(AUTH, { connector : new Blynk.TcpClient(   { addr:"", port:8080 } ) });
const { exec } = require("child_process");

var V_PIN_0_RPI_REBOOT = new blynk.VirtualPin(0);
var V_PIN_TERMINAL = new blynk.VirtualPin(2);
var term = new blynk.WidgetTerminal(1);

// ----- RPi Reboot Command -----
V_PIN_0_RPI_REBOOT.on('write', function(param) {
      if (param[0] == '0') {
         exec("sudo systemctl restart blynk-start.service", (error, stdout, stderr) => {
    	    if (error) {
        	console.log(`error: ${error.message}`);
                term.on(`write`, function(data) {
		   term.write(`Error: ${error.message}` + `\n`);
		   //blynk.notify("HAHA! " + data);
                });
		V_PIN_TERMINAL.on(`read`, function() {
		   V_PIN_TERMINAL.write(`Error: ${error.message}` + `\n`);
		});
        	return;
    	    }
            if (stderr) {
               console.log(`stderr: ${stderr}`);
               term.on(`write`, function(data) {
                   term.write(`Error:` + `stderr: ${stderr}` + `\n`);
                });
                V_PIN_TERMINAL.on(`read`, function() {
                   V_PIN_TERMINAL.write(`stderr: ${stderr}` + `\n`);
                });

               return;
            }
            console.log(`stdout: ${stdout}`);
            term.on(`write`, function(data) {
               term.write(`Error:` + `stdout: ${stdout}` + `\n`);
            });
                V_PIN_TERMINAL.on(`read`, function() {
                   V_PIN_TERMINAL.write(`Restart SUCCESSFUL stdout: ${stdout}` + `\n`);
                });


         });
      }
});
