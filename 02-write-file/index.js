const fs = require("fs");
const path = require("path");
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });
const filePath = path.join(__dirname, "write.txt");

console.log('Hi, enter your message and press "enter" button to write it into the file. \nTo finish: type "exit" and press "enter" button or press "Ctrl+C"');

rl.on("line", function(line){
    if(line === "exit"){
      rl.close();
      return
    };

    fs.appendFile(filePath, line + "\n",
        err => {
            if (err){
              console.error(err.message);
              return
            }
        }
    );
});

rl.on ("close", function(){
  console.log("All is done!")
});