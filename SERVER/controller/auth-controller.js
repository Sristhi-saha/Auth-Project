import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../model/usermodel.js";
import transporter from "../config/nodemailer.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }


    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",       // HTTPS only in prod
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // cross-site in prod
  maxAge: 7 * 24 * 60 * 60 * 1000,                    // 7 days
});


    await transporter.sendMail({
      from: `"Auth App" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Welcome to Auth App",
      text: `Welcome! Your account has been created using ${email}`,
    });

    return res.json({ success: true, data: user });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email & password required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Login successful" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

/* ================= SEND VERIFY OTP ================= */
export const sentVerifyOtp = async (req, res) => {
  try {
    const  id  = req.user.id;
    if (!id) {
      return res.json({ success: false, message: "User id missing"});
    }
    console.log(id);
    const user = await userModel.findById(id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "Already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: `"Auth App" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Verify your email",
      text: `Your OTP is ${otp}. Valid for 24 hours.`,
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

/* ================= VERIFY EMAIL ================= */
export const verifyEmail = async (req, res) => {
  try {
    const {  otp } = req.body;
    const userId = req.user.id;

    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing details" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpireAt = null;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

/* ================= AUTH CHECK ================= */
export const isAuthenticated = async (req, res) => {
  return res.json({ success: true });
};

/* ================= SEND RESET OTP ================= */
export const sendPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    await transporter.sendMail({
      from: `"Auth App" <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Reset Password OTP",
      text: `Your reset password OTP is ${otp}`,
    });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.json({ success: false, message: "Missing credentials" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // if (!user.resetOtp || user.resetOtp !== otp) {
    //   console.log(user.resetOtp, otp);
    //   return res.json({ success: false, message: "Invalid OTP" });
    // }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    user.resetOtpExpireAt = null;
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (e) {
    return res.json({ success: false, message: e.message });
  }
};
