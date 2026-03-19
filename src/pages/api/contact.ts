import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const AGENTMAIL_API_KEY = import.meta.env.AGENTMAIL_API_KEY;
  const INBOX_ID = "xprsv-general";

  if (!AGENTMAIL_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Mail service not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { name, email, message } = body;
  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: "All fields are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const htmlBody = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, "<br>")}</p>
  `;

  const textBody = `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

  try {
    const res = await fetch(
      `https://api.agentmail.to/v0/inboxes/${INBOX_ID}/messages/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AGENTMAIL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: `${INBOX_ID}@agentmail.to`,
          reply_to: email,
          subject: `Portfolio Contact: ${name}`,
          html: htmlBody,
          text: textBody,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("AgentMail error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to send message" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("AgentMail request failed:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send message" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
