import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// email route
app.post("/send-email", async (req, res) => {
  const { name, email, message, siteName,subtitle } = req.body;

  if (!name || !email || !message || !siteName || !subtitle) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const formattedMessage = message
    .replace(/\n/g, "<br/>")
    .replace(/\s{2,}/g, " ");

  const brand = siteName || "Portfolio Website";

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // =========================
    // 📩 EMAIL TO YOU (ADMIN)
    // =========================
    await transporter.sendMail({
      from: `"${brand}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Project Inquiry from ${brand}`,
      html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; padding:40px; background:#f0fdfa;">
  <div style="max-width:680px; margin:auto; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 15px 35px rgba(20, 184, 166, 0.1);">
    
    <!-- HEADER -->
    <div style="background:linear-gradient(135deg, #10b981, #14b8a6); padding:30px; text-align:center;">
      <h1 style="color:#ffffff; margin:0; font-size:24px; letter-spacing:1px;">
        ${brand}
      </h1>
      <p style="color:#ccfbf1; margin:5px 0 0; font-size:14px;">
        ${subtitle}
      </p>
    </div>

    <!-- BODY -->
    <div style="padding:40px;">
      <h2 style="color:#0f172a; margin-top:0;">New Business Opportunity 🚀</h2>
      <p style="color:#475569; font-size:15px; line-height:1.6;">
        Great news! You've received a new inquiry from your digital marketing portfolio. Here are the details:
      </p>

      <div style="margin-top:25px; padding:20px; background:#f0fdf4; border-radius:12px; border:1px solid #dcfce7;">
        <p style="margin:0 0 10px 0; color:#065f46;"><strong>Lead Name:</strong> ${name}</p>
        <p style="margin:0; color:#065f46;"><strong>Lead Email:</strong> ${email}</p>
      </div>

      <div style="margin-top:30px;">
        <h3 style="color:#0d9488; font-size:16px; text-transform:uppercase; letter-spacing:1px;">Client Message</h3>
        <div style="padding:20px; background:#f8fafc; border-left:5px solid #10b981; border-radius:4px; color:#334155; line-height:1.7;">
          ${formattedMessage}
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div style="background:#f1f5f9; padding:20px; text-align:center; font-size:12px; color:#64748b;">
      © ${new Date().getFullYear()} Md Fuad Amir • Growth Strategy & Digital Marketing
    </div>
  </div>
</div>
`,
    });

    // =========================
    // 📩 AUTO REPLY TO CLIENT
    // =========================
    await transporter.sendMail({
      from: `${brand}`,
      to: email,
      subject: `✨ Thanks for contacting ${brand}`,
      html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f0fdfa; padding:40px;">
  <div style="max-width:650px; margin:auto; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 15px 35px rgba(20, 184, 166, 0.1);">

    <!-- HEADER -->
    <div style="background:linear-gradient(135deg, #10b981, #14b8a6); padding:35px; text-align:center;">
      <h1 style="color:white; margin:0; font-size:26px;">${brand}</h1>
      <p style="color:#ccfbf1; font-size:14px; margin-top:5px;">${subtitle}</p>
    </div>

    <!-- BODY -->
    <div style="padding:40px;">
      <h2 style="color:#0f172a; margin-top:0;">Hi ${name}, 👋</h2>
      <p style="color:#475569; line-height:1.8; font-size:15px;">
        Thank you for reaching out! I've received your request regarding a potential digital marketing collaboration. 
      </p>
      <p style="color:#475569; line-height:1.8; font-size:15px;">
        I am passionate about helping brands scale through strategic SEO, high-converting ad campaigns, and social media growth. I'll review your goals and get back to you shortly.
      </p>

      <div style="margin:25px 0; padding:20px; background:#f0fdf4; border-radius:12px; border-left:5px solid #14b8a6;">
        <p style="margin-bottom:8px; color:#0d9488;"><strong>Summary of your inquiry:</strong></p>
        <div style="color:#334155; font-style:italic;">
          "${formattedMessage}"
        </div>
      </div>

      <p style="color:#475569; line-height:1.8;">
        Expect a detailed response from me within <b>24 hours</b>. In the meantime, feel free to prepare any specific KPIs or business targets you'd like to discuss.
      </p>

      <hr style="margin:30px 0; border:none; border-top:1px solid #e2e8f0;" />

      <p style="color:#0f172a; margin-bottom:5px;">Best Regards,</p>
      <p style="color:#10b981; font-weight:bold; font-size:18px; margin:0;">Md Fuad Amir</p>
      <p style="color:#64748b; font-size:13px; margin:0;">MERN Stack</p>

    </div>

    <!-- FOOTER -->
    <div style="text-align:center; padding:20px; font-size:12px; color:#94a3b8; background:#f8fafc;">
      © ${new Date().getFullYear()} Md Fuad Amir. MERN Stack Web Developer.
    </div>
  </div>
</div>
`,
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

export default app;
