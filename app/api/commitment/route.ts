import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { sendMyTurnNotification } from "../../../lib/myTurnEmail";

export const runtime = "nodejs";

type CommitmentBody = {
  firstName?: string;
  commitment?: string;
};

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as CommitmentBody;

    const firstName =
      body.firstName?.trim() ?? "";

    const commitment =
      body.commitment?.trim() ?? "";

    if (
      !firstName ||
      !commitment
    ) {
      return NextResponse.json(
        {
          error:
            "Add your first name and what you plan to do.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      firstName.length > 50
    ) {
      return NextResponse.json(
        {
          error:
            "Please keep your first name under 50 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      commitment.length > 500
    ) {
      return NextResponse.json(
        {
          error:
            "Please keep your commitment under 500 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from(
        "my_turn_commitments"
      )
      .insert({
        first_name:
          firstName,
        commitment,
      })
      .select(
        "id, first_name, commitment, created_at"
      )
      .single();

    if (error) {
      console.error(
        "Commitment save error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Something went wrong while adding your commitment. Please try again.",
        },
        {
          status: 500,
        }
      );
    }

    try {
      await sendMyTurnNotification({
        subject: `New My Turn commitment from ${firstName}`,
        heading:
          "Someone is making room for something this week",
        lines: [
          `Name: ${firstName}`,
          `This week I'm making room for: ${commitment}`,
        ],
      });
    } catch (emailError) {
      console.error(
        "Commitment saved but notification email failed:",
        emailError
      );
    }

    return NextResponse.json({
      success: true,
      commitment: {
        id:
          data.id,
        firstName:
          data.first_name,
        text:
          data.commitment,
        createdAt:
          data.created_at,
      },
    });
  } catch (error) {
    console.error(
      "Commitment route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while adding your commitment. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}