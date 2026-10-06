import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { sendMyTurnNotification } from "../../../lib/myTurnEmail";

export const runtime = "nodejs";

type CommunityReplyBody = {
  postId?: string;
  firstName?: string;
  body?: string;
};

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as CommunityReplyBody;

    const postId =
      body.postId?.trim() ?? "";

    const firstName =
      body.firstName?.trim() ?? "";

    const replyBody =
      body.body?.trim() ?? "";

    if (
      !postId ||
      !firstName ||
      !replyBody
    ) {
      return NextResponse.json(
        {
          error:
            "Add your first name and your reply.",
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
      replyBody.length > 750
    ) {
      return NextResponse.json(
        {
          error:
            "Please keep your reply under 750 characters.",
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
        "my_turn_community_replies"
      )
      .insert({
        post_id:
          postId,
        first_name:
          firstName,
        body:
          replyBody,
      })
      .select(
        "id, post_id, first_name, body, created_at"
      )
      .single();

    if (error) {
      console.error(
        "Community reply save error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Something went wrong while adding your reply. Please try again.",
        },
        {
          status: 500,
        }
      );
    }

    try {
      await sendMyTurnNotification({
        subject: `New My Turn community reply from ${firstName}`,
        heading:
          "A new reply has been added to the My Turn community",
        lines: [
          `Reply from: ${firstName}`,
          "",
          replyBody,
        ],
      });
    } catch (emailError) {
      console.error(
        "Community reply saved but notification email failed:",
        emailError
      );
    }

    return NextResponse.json({
      success: true,
      reply: {
        id:
          data.id,
        postId:
          data.post_id,
        firstName:
          data.first_name,
        body:
          data.body,
        createdAt:
          data.created_at,
      },
    });
  } catch (error) {
    console.error(
      "Community reply route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while adding your reply. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}