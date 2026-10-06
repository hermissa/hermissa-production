import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+0-9 ()/.-]*$/)
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(1).max(5000),
  lang: z.enum(["de", "en"]).optional(),
  // Honeypot: must stay empty
  website: z.string().max(0).optional().or(z.literal("")),
});

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["RESEND_API_KEY"];
        const to = process.env["CONTACT_TO_EMAIL"];
        const from =
          process.env["CONTACT_FROM_EMAIL"] ?? "HERMISSA <kontakt@hermissa.ch>";
        if (!apiKey || !to) {
          console.error("Contact: RESEND_API_KEY or CONTACT_TO_EMAIL missing");
          return json({ ok: false, error: "server_config" });
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return json({ error: "invalid_input" }, 400);
        }
        const parsed = schema.safeParse(raw);
        if (!parsed.success) return json({ error: "invalid_input" }, 400);
        const { name, email, phone, message, website } = parsed.data;
        if (website) return json({ ok: true }); // bot

        const rows: [string, string][] = [
          ["Name", name],
          ["E-Mail", email],
          ...(phone ? [["Telefon", phone] as [string, string]] : []),
        ];
        const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nNachricht:\n${message}`;
        const html = `<div style="font-family:Arial,sans-serif;color:#111">
<h2 style="font-weight:normal">Neue Kontaktanfrage über hermissa.ch</h2>
${rows.map(([k, v]) => `<p><strong>${k}:</strong> ${escapeHtml(v)}</p>`).join("")}
<p><strong>Nachricht:</strong></p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p></div>`;

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [to],
            reply_to: email,
            subject: "Neue Kontaktanfrage über hermissa.ch",
            text,
            html,
          }),
        });
        if (!res.ok) {
          console.error(`Resend failed [${res.status}]: ${await res.text()}`);
          return json({ ok: false, error: "send_failed" });
        }
        return json({ ok: true });
      },
    },
  },
});
