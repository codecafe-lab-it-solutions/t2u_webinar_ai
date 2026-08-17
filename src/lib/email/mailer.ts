import nodemailer, { type Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: getEnv("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: getEnv("SMTP_USER"),
      pass: getEnv("SMTP_PASSWORD"),
    },
  });

  return cachedTransporter;
}

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendMail({ to, subject, html, text }: SendMailInput): Promise<void> {
  const transporter = getTransporter();
  const fromEmail = getEnv("SMTP_FROM_EMAIL");
  const fromName = process.env.SMTP_FROM_NAME ?? "T2Upgrade";
  const replyTo = process.env.SMTP_REPLY_TO ?? fromEmail;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    replyTo,
    to,
    subject,
    html,
    text,
  });
}
