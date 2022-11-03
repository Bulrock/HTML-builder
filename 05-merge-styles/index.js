const fs = require("fs");
const path = require("path");

const srcFolderPath = path.join(__dirname, "/styles");
const distFolderPath = path.join(__dirname, "/project-dist");
const removedFile = path.join(distFolderPath, "/bundle.css");

fs.access(removedFile, fs.constants.F_OK, (err) => {
  if(!err){
      fs.rm(removedFile, { recursive:true }, (err) => {
          if(err){
              console.error(err.message);
              return;
          }
      });
  };
});

fs.readdir(srcFolderPath,
  (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      if(file){
        let fileSrcFullPath = path.join(srcFolderPath, "/", file);
        let fileDistFullPath = path.join(distFolderPath, "/bundle.css");

        const stream = new fs.ReadStream(fileSrcFullPath, "utf-8");

      fs.stat(fileSrcFullPath, function(err, stats){
          if(err) console.error(err.message);

          if(stats.isFile()){
            let fileExtension = path.parse(fileSrcFullPath).ext;
            if(fileExtension === ".css"){
              let data = "";
              stream.on('data', chunk => data += chunk);
              stream.on('end', () => {

              fs.appendFile(fileDistFullPath, data,
                err => {
                  if (err) console.error(err.message);
                });
              });
              stream.on('error', error => console.err(error.message));
            }
          }
        });
      };
    });
  };
});