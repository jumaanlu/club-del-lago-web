import express from "express";
import path from "path";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route to send emails
app.post("/api/send-email", async (req, res) => {
  const { nombre, email, mensaje } = req.body;
  const resendApiKey = process.env.RESEND_API_KEY;
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "atencionaasociados@clubdelago.com.mx";

  if (!resendApiKey) {
    console.error("RESEND_API_KEY is missing");
    return res.status(500).json({ error: "Configuración de correo incompleta" });
  }

  const resend = new Resend(resendApiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Club del Lago <onboarding@resend.dev>', // Resend permite este remitente para pruebas
      to: [receiverEmail],
      subject: `Nuevo Mensaje de Contacto: ${nombre}`,
      html: `
        <h2>Nuevo mensaje desde la página web</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
        <hr />
        <p>Este es un correo automático enviado desde el sitio web de Club del Lago.</p>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return res.status(400).json(error);
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Server error sending email:", error);
    res.status(500).json({ error: "Error interno al enviar el correo" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
