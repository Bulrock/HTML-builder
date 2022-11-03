const fs = require("fs");
const path = require("path");
const fsPromises = fs.promises;

const srcFolderPath = path.join(__dirname, "/files");
const distFolderPath = path.join(__dirname, "/files-copy");

fsPromises.mkdir(distFolderPath).then(function() {
    console.log('Directory created successfully');
  }).catch(function() {
    console.log('failed to create directory');
});

fs.readdir(srcFolderPath,
  (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      if(file){
        let fileSrcFullPath = path.join(srcFolderPath, "/", file);
        let fileDistFullPath = path.join(distFolderPath, "/", file);

        fs.copyFile(fileSrcFullPath, fileDistFullPath, (err) => {
          console.log(`copied ${file}`);
          if(err) {
            console.error(err.message);
          }
        });
      };
    });
  };
});
