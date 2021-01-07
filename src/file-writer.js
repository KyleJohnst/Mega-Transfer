const fs = require("fs");

const writeNewFileToDisk = async (fileType, name, data) => {
  fs.writeFile(name+'.'+fileType, data, function (err) {
    if (err) return console.log(err);
    console.log(data + ' > ' + name+'.'+fileType);
  });
};

module.exports = {
    writeNewFileToDisk,
};
