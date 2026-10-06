import {
  NextRequest,
  NextResponse,
} from "next/server";
import crypto from "crypto";
import {
  adminCookieName,
  createAdminSessionToken,
} from "../../../../lib/adminAuth";

export const runtime = "nodejs";

function passwordsMatch(
  supplied: string,
  expected: string
) {
  const suppliedHash =
    crypto
      .createHash("sha256")
      .update(supplied)
      .digest();

  const expectedHash =
    crypto
      .createHash("sha256")
      .update(expected)
      .digest();

  return crypto.timingSafeEqual(
    suppliedHash,
    expectedHash
  );
}

export async function POST(
  request: NextRequest
) {
  const ownerPassword =
    process.env
      .MY_TURN_ADMIN_PASSWORD;

  const partnerPassword =
    process.env
      .MY_TURN_PARTNER_ADMIN_PASSWORD;

  const adminSecret =
    process.env
      .MY_TURN_ADMIN_SECRET;

  if (
    !ownerPassword ||
    !adminSecret
  ) {
    return NextResponse.json(
      {
        error:
          "Admin access is not configured.",
      },
      {
        status: 503,
      }
    );
  }

  try {
    const body =
      await request.json();

    const password =
      typeof body.password ===
      "string"
        ? body.password
        : "";

    const ownerMatch =
      password &&
      passwordsMatch(
        password,
        ownerPassword
      );

    const partnerMatch =
      password &&
      partnerPassword
        ? passwordsMatch(
            password,
            partnerPassword
          )
        : false;

    if (
      !ownerMatch &&
      !partnerMatch
    ) {
      return NextResponse.json(
        {
          error:
            "Incorrect access code.",
        },
        {
          status: 401,
        }
      );
    }

    const response =
      NextResponse.json({
        success: true,
      });

    response.cookies.set(
      adminCookieName,
      createAdminSessionToken(),
      {
        httpOnly: true,
        sameSite: "strict",
        secure:
          process.env
            .NODE_ENV ===
          "production",
        path: "/",
        maxAge:
          12 * 60 * 60,
      }
    );

    return response;
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to sign in.",
      },
      {
        status: 400,
      }
    );
  }
}