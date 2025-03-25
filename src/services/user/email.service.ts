import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "ifatranslator@gmail.com",
    pass: process.env.EMAIL_PASS || "gaNfid-nyzton-tigny2",
  },
});

export const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const verificationLink = `${
    process.env.BASE_URL || "http://localhost:8000"
  }/api/v1/users/verify-email?token=${token}`;
  console.log("vrlink", verificationLink);
  console.log("emailToken", token);
  console.log("email is ", email);
  const mailOptions = {
    from: process.env.EMAIL_USER || "ifatranslator@gmail.com",
    to: email,
    subject: "email verification",
    html: `
            <h3>Welcame to register!</h3>
            <p>Please click this link to activate your account:</p>
            <a href="${verificationLink}">verify the email</a>
            <p>this link expires after 24 hours</p>
        `,
  };
  console.log("ready to send");
  console.log(mailOptions);
  try {
    await transporter.sendMail(mailOptions); //*
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }

  console.log("sent already");
};
