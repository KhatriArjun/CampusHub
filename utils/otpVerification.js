import nodemailer from "nodemailer";

import OtpModel from "../Model/Otp.js";
import bcrypt from "bcrypt";

export const sendEmail = async (email) => {
  let otp = await otpGenerator(email);

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
<<<<<<< HEAD
        user: 'arvilla.altenwerth@ethereal.email',
        pass: 'XCRGDPdA7DV9zuBgbD'
    },
=======
      user: 'esteban.emard@ethereal.email',
      pass: 'c5xCkKpWkXJwhJYHZ3'
  }
>>>>>>> 2b76dd026f16b0f15781e4d72aa21e306055e5d6
  });
  async function main() {
    const info = await transporter.sendMail({
      from: '"Fred Foo" <campushub@gmail.com>',
      to: email,
      subject: "Hello ",
      text: `${otp}`,
      html: `<b>${otp}</b>`,
    });
  }
  main();
};

const otpGenerator = async (email) => {
  let otp = "";
  for (let i = 0; i <= 4; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  //   const hashedOtp = await bcrypt.hash(otp, 10);
  const newOtpData = {
    value: otp,
    sent: 1,
    senderName: email,
  };

  const otpvalue = await OtpModel.create(newOtpData);

  return otp;
};

export const otpAuthenticate = (otp, user_otp) => {
  if (user_otp == otp) {
    return true;
  } else {
    return false;
  }
};

export const otpVerify = async (req, res) => {
  //   let otp = otpGenerator();

  let authenticate = otpAuthenticate(otp, user_otp);
  if (authenticate) {
    res.status(401).json({ message: "Successfully matched!!" });
  } else {
    res.status(404).json({ error: "Do not matches the OTP" });
  }
};
