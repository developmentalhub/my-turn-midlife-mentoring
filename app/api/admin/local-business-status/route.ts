import {
  NextRequest,
  NextResponse,
} from "next/server";

import { cookies } from "next/headers";

import {
  adminCookieName,
  verifyAdminSessionToken,
} from "../../../../lib/adminAuth";

import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest
) {
  try {
    const cookieStore =
      cookies();

    const token =
      cookieStore.get(
        adminCookieName
      )?.value;

    if (
      !verifyAdminSessionToken(
        token
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Admin access required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const id =
      typeof body.id ===
      "string"
        ? body.id.trim()
        : "";

    const status =
      typeof body.status ===
      "string"
        ? body.status.trim()
        : "";

    if (
      !id ||
      ![
        "pending",
        "approved",
        "rejected",
      ].includes(status)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid business or status.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "my_turn_local_applications"
        )
        .update({
          status,
        })
        .eq(
          "id",
          id
        )
        .select(
          "id, status"
        )
        .single();

    if (error) {
      console.error(
        "Local business status update error:",
        error
      );

      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      business: data,
    });
  } catch (error) {
    console.error(
      "Local business admin route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong updating the business.",
      },
      {
        status: 500,
      }
    );
  }
}