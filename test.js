import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// console.log("__filename:", __filename);
// console.log("__dirname:", __dirname);
const folder_path = path.resolve(__dirname, ".");

const create_folder = async () => {
  fs.stat(folder_path + "/assignment", (error, status) => {
    if (status == undefined) {
      fs.mkdir(folder_path + "/assignment", { recursive: true }, (err) => {
        if (err) {
          console.log("Cannot create folder");
        } else {
          console.log("folder is created successfully");
        }
      });
    } else {
      console.log("folder already exist");
    }
  });
};
// create_folder();
const save_new_file = () => {
  // fs.stat(folder_path + "/assignment/finaldefense.pdf" , (err , status) => {
  // if(status == undefined){
  let file_name = path.basename(folder_path + "/finaldefense.pdf");
  console.log(file_name);
  let destination_path = path.join(
    folder_path + "/assignment/",
    Date.now() + "_" + file_name
  );
  console.log(destination_path);
  // console.log(file_path)
  fs.copyFile(folder_path + "/finaldefense.pdf", destination_path, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("file is copied successfully");
    }
  });
  // }
  //})
};
save_new_file();

// console.log(path.basename(folder_path + "/finaldefense.pdf"))
