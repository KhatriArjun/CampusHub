import express from "express";

let router = express.Router();

const encrypt = (str, key) => {
  let encrypted = "";
  str = str.message;
  for (let i = 0; i < str.length; i++) {
    let ascii = str[i].charCodeAt();
    if (ascii >= 65 && ascii <= 90) {
      encrypted += String.fromCharCode(((ascii + key - 65 + 26) % 26) + 65);
    } else if (ascii >= 97 && ascii <= 122) {
      encrypted += String.fromCharCode(((ascii + key - 97 + 26) % 26) + 97);
    } else {
      encrypted += str[i];
    }
  }

  return encrypted;
};

export default encrypt;
