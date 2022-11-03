const fs = require("fs");
const path = require("path");

const secretFolderPath = path.join(__dirname, "/secret-folder");

fs.readdir(secretFolderPath,
    (err, files) => {
    if (err){
      console.log(err);
      return
    } else {
      files.forEach(file => {
        if(file){
          let fileFullPath = path.join(secretFolderPath, "/", file);

          fs.stat(fileFullPath, function(err, stats){
            if(err){
              console.error(err.message);
              return
            };
            if(stats.isFile()){
              let fileName = path.parse(fileFullPath).name;
              let fileExtension = path.parse(fileFullPath).ext.slice(1);
              let fileSize = `${(stats.size)/1000}kb`;
              let fileInfo = "".concat(fileName, " - ", fileExtension, " - ", fileSize);
              console.log(fileInfo);
            }
          });
        };
      });
    };
  });