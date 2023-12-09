import jwt from "jsonwebtoken";
let token = jwt.sign({ foo: "bar" }, "helll");
console.log(token);
let decode = jwt.verify(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE3MDIxMjM5Nzd9.akEa1RoYa2GTiiWMAPz4Spt8SncMCp5IEr9YYigk4rM",
  "helll"
);

console.log(decode);
