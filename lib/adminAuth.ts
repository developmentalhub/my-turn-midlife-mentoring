import crypto from "crypto";

const COOKIE_NAME = "my-turn-admin-session";

function getSecret() {
  const secret =
    process.env.MY_TURN_ADMIN_SECRET;

  if (!secret) {
    throw new Error(
      "Missing MY_TURN_ADMIN_SECRET"
    );
  }

  return secret;
}

export function createAdminSessionToken() {
  const expires =
    Date.now() +
    12 * 60 * 60 * 1000;

  const payload = `my-turn-admin:${expires}`;

  const signature = crypto
    .createHmac(
      "sha256",
      getSecret()
    )
    .update(payload)
    .digest("hex");

  return `${payload}:${signature}`;
}

export function verifyAdminSessionToken(
  token?: string
) {
  if (!token) {
    return false;
  }

  const parts =
    token.split(":");

  if (parts.length !== 4) {
    return false;
  }

  const [
    name,
    role,
    expiresString,
    suppliedSignature,
  ] = parts;

  if (
    name !== "my-turn" ||
    role !== "admin"
  ) {
    return false;
  }

  const expires =
    Number(expiresString);

  if (
    !Number.isFinite(expires) ||
    expires < Date.now()
  ) {
    return false;
  }

  const payload =
    `${name}:${role}:${expiresString}`;

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        getSecret()
      )
      .update(payload)
      .digest("hex");

  const suppliedBuffer =
    Buffer.from(
      suppliedSignature
    );

  const expectedBuffer =
    Buffer.from(
      expectedSignature
    );

  if (
    suppliedBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    suppliedBuffer,
    expectedBuffer
  );
}

export const adminCookieName =
  COOKIE_NAME;