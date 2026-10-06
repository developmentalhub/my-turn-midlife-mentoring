import { Resend } from "resend";

const resendApiKey =
  process.env.RESEND_API_KEY;

const fromEmail =
  process.env.MY_TURN_FROM_EMAIL;

const ownerEmail =
  process.env.MY_TURN_NOTIFY_EMAIL;

const partnerEmail =
  process.env.MY_TURN_PARTNER_NOTIFY_EMAIL;

function escapeHtml(
  value: string
) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendMyTurnNotification({
  subject,
  heading,
  lines,
}: {
  subject: string;
  heading: string;
  lines: string[];
}) {
  if (!resendApiKey) {
    throw new Error(
      "RESEND_API_KEY is missing."
    );
  }

  if (!fromEmail) {
    throw new Error(
      "MY_TURN_FROM_EMAIL is missing."
    );
  }

  if (!ownerEmail) {
    throw new Error(
      "MY_TURN_NOTIFY_EMAIL is missing."
    );
  }

  const recipients = [
    ownerEmail,
    partnerEmail,
  ].filter(
    (email): email is string =>
      Boolean(email)
  );

  const resend =
    new Resend(resendApiKey);

  const content = lines
    .filter(Boolean)
    .map(
      (line) => `
        <p
          style="
            margin:0 0 14px;
            line-height:1.6;
          "
        >
          ${escapeHtml(line)}
        </p>
      `
    )
    .join("");

  const {
    data,
    error,
  } = await resend.emails.send({
    from: fromEmail,
    to: recipients,
    subject,
    html: `
      <div
        style="
          max-width:620px;
          margin:0 auto;
          padding:32px;
          background:#fffdf8;
          color:#24373d;
          font-family:Arial,sans-serif;
        "
      >
        <p
          style="
            margin:0 0 10px;
            font-size:12px;
            letter-spacing:2px;
            text-transform:uppercase;
            color:#557f91;
          "
        >
          My Turn
        </p>

        <h1
          style="
            margin:0 0 24px;
            font-size:30px;
            line-height:1.2;
            font-family:Georgia,serif;
            font-weight:normal;
            color:#24373d;
          "
        >
          ${escapeHtml(heading)}
        </h1>

        ${content}

        <p
          style="
            margin:30px 0 0;
            padding-top:20px;
            border-top:1px solid #d8e4e7;
            font-size:13px;
            line-height:1.5;
            color:#71858d;
          "
        >
          You can review this in your
          My Turn admin dashboard.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error(
      "My Turn notification email failed:",
      error
    );

    throw new Error(
      error.message
    );
  }

  return data;
}