const fs = require("fs");
const path = require("path");

const srcStylesFolderPath = path.join(__dirname, "/styles");
const distProjectFolderPath = path.join(__dirname, "/project-dist");
// const removedFile = path.join(distProjectFolderPath, "/style.css");
const srcTemplateFolderPath = path.join(__dirname, "/template.html");
const distTemplateFilePath = path.join(distProjectFolderPath, "/index.html");
const srcAssetsFolderPath = path.join(__dirname, "/assets");
const distAssetsFolderPath = path.join(distProjectFolderPath, "/assets");
const fsPromises = fs.promises;
const fileContentHeader = path.join(__dirname, "/components", "header.html");
const fileContentArticles = path.join(__dirname, "/components", "articles.html");
const fileContentFooter = path.join(__dirname, "/components", "footer.html");

fs.access(distProjectFolderPath, fs.constants.F_OK, (err) => {
  if(!err){
    fs.rm(distProjectFolderPath, { recursive:true }, (err) => {
      if(err){
        console.error(err.message);
        return;
      }
      createDirectory();
    });
    } else {
      createDirectory();
    }
});

function createDirectory(){
    fsPromises.mkdir(distProjectFolderPath).then(function() {
        console.log("Directory 'project-dist' created successfully");

        fs.copyFile(srcTemplateFolderPath, distTemplateFilePath, (err) => {
            console.log("");
            if(err) {
              console.error(err.message);
              return
            }

            createBundle();

            createStyleCss();

            createFolder(distAssetsFolderPath);

            copyAssetsFiles(srcAssetsFolderPath, distAssetsFolderPath);
        });
      }).catch(function() {
        console.log("failed to create 'project-dist' directory");
    });
};

function createBundle(){
    fs.readFile(distTemplateFilePath, "utf8", (error, distTemplateData) => {
        if(error){
            console.error(error.message);
            return
        }

        fs.readFile(fileContentHeader, "utf8", (errorHeader, headerData) => {
            if(errorHeader){
                console.error(errorHeader.message);
                return
            }
            distTemplateData = distTemplateData.replace(/\{\{header\}\}/, headerData);

            fs.readFile(fileContentArticles, "utf8", (errorArticles, articlesData) => {
                if(errorArticles){
                    console.error(errorArticles.message);
                    return
                }
                distTemplateData = distTemplateData.replace(/\{\{articles\}\}/, articlesData);

                fs.readFile(fileContentFooter, "utf8", (errorFooter, footerData) => {
                    if(errorFooter){
                        console.error(errorFooter.message);
                        return
                    }
                    distTemplateData = distTemplateData.replace(/\{\{footer\}\}/, footerData);

                    fs.writeFile(distTemplateFilePath, distTemplateData, "utf8", (errorWriteBundle) =>{
                        if(errorWriteBundle){
                            console.error(errorWriteBundle.message);
                            return
                        }
                        console.log("File index.html created!")
                    })
                });
            });
        });
    });
}

function createStyleCss(){
    fs.readdir(srcStylesFolderPath,
        (err, files) => {
        if (err){
            console.log(err);
            return
        } else {
          files.forEach(file => {
            if(file){
              let fileSrcFullPath = path.join(srcStylesFolderPath, "/", file);
              let fileDistFullPath = path.join(distProjectFolderPath, "/style.css");

              const stream = new fs.ReadStream(fileSrcFullPath, "utf-8");

            fs.stat(fileSrcFullPath, function(err, stats){
                if(err) console.error(err.message);

                if(stats.isFile()){
                  let fileExtension = path.parse(fileSrcFullPath).ext;
                  if(fileExtension === ".css"){
                    let data = "";
                    stream.on("data", chunk => data += chunk);
                    stream.on("end", () => {

                    fs.appendFile(fileDistFullPath, data,
                      err => {
                        if (err) console.error(err.message);
                      });
                    });
                    stream.on("error", error => console.err(error.message));
                  }
                }
              });
            };
          });
        };
    });
}

function createFolder(folderPath){
    fsPromises.mkdir(folderPath).then(function() {
        console.log(`Directory '${folderPath}' created successfully`);
      }).catch(function() {
        console.log("failed to create 'assets' directory");
    });
}

function copyAssetsFiles(folderPath, distPath){
    fs.readdir(folderPath,
        (err, files) => {
        if (err){
            console.log(err);
            return
        } else {
          files.forEach(file => {
            let fileSrcFullPath = path.join(folderPath, "/", file);
            fs.stat(fileSrcFullPath, function(err, stats){
                if(err){
                    console.error(err.message);
                    return
                }

                let fileDistFullPath = path.join(distPath, "/", file);

                if(stats.isFile()){
                    fs.copyFile(fileSrcFullPath, fileDistFullPath, (err) => {
                      console.log(`copied ${file}`);
                      if(err) {
                        console.error(err.message);
                      }
                    });
                }else{
                    createFolder(fileDistFullPath)
                    copyAssetsFiles(fileSrcFullPath, fileDistFullPath);
                }
              });
          });
        };
    });
}
