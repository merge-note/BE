import { Request, Response } from "express";
import { userService } from "../../services/userService";
import axios from "axios";
import * as nodeMailer from "nodemailer";
require("dotenv").config();

interface CustomRequest extends Request {
  userId?: number;
}

export const userController = {
  signup: async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
    try {
      const rows = await userService.signupUser(email, name, password);
      res.status(201).send("User registered successfully!");
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  signin: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { token, name, picture } = await userService.authUser(
        email,
        password
      );
      res.cookie("token", token, { httpOnly: true });
      res.send({ token, name, picture });
    } catch (err: any) {
      if (err.message === "User not found") {
        res.status(404).send("Email does not exist.");
      } else if (err.message === "Invalid password") {
        res.status(401).send("Invalid password.");
      } else {
        console.error(err);
        res.status(500).send("Error signing in user");
      }
    }
  },
  deleteUser: async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const result = await userService.deleteUser(userId);
      if (result) {
        res.status(200).json({ message: "User successfully deleted" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  verifyEmail: async (req: CustomRequest, res: Response) => {
    const { email } = req.body;

    try {
      const transporter = nodeMailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const verificationCode = Math.floor(Math.random() * 9000) + 1000;

      const mailOptions = {
        to: email,
        subject: "Email Verification",
        text: `Your verification code is: ${verificationCode}`,
      };

      await transporter.sendMail(mailOptions);

      res
        .status(200)
        .json({ message: "Verification code sent", verificationCode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to send email" });
    }
  },
  oAuth: async (req: CustomRequest, res: Response) => {
    const accessToken = req.body.accessToken;
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
      );
      const { token, name, picture } = await userService.authUserWithOAuth(
        data
      );

      res.cookie("token", token, { httpOnly: true });
      res.send({ token, name, picture });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch user data" });
    }
  },
};
