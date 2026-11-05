import "server-only";

// Envío de emails transaccionales con Resend (https://resend.com) por su API
// HTTP, sin dependencias. Variables: RESEND_API_KEY y EMAIL_FROM
// (ej. "Investments Paraguay <no-responder@investmentsparaguay.com>").

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("Falta RESEND_API_KEY o EMAIL_FROM: no se pueden enviar emails.");
    this.name = "EmailNotConfiguredError";
  }
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(message: EmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new EmailNotConfiguredError();

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend respondió ${response.status}: ${detail.slice(0, 300)}`);
  }
}
