import jwt from "jsonwebtoken";

const getToken = async (email, user) => {
  const token = jwt.sign({ identifier: user._id }, "#hisIsSecretKey");
  return token;
};

export default getToken;
