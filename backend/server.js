const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 1025,
    secure: false
});


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Azka Portfolio Backend is running."
    });
});


app.post("/api/contact", async (req, res) => {

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    try {

        await transporter.sendMail({
            from: "portfolio@localhost",
            to: "azka@localhost",
            replyTo: email,
            subject: `Portfolio Message - ${name}`,
            text: `
Name: ${name}
Email: ${email}

Message:
${message}
            `
        });

        console.log("EMAIL SENT TO MAILPIT");

        res.json({
            success: true,
            message: "Email sent successfully."
        });

    } catch (error) {

        console.error("MAIL ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send email."
        });

    }
});


app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});