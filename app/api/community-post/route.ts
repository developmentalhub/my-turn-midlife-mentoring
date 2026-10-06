import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { sendMyTurnNotification } from "../../../lib/myTurnEmail";

export const runtime = "nodejs";

type CommunityPostBody = {
  firstName?: string;
  body?: string;
};

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as CommunityPostBody;

    const firstName =
      body.firstName?.trim() ?? "";

    const postBody =
      body.body?.trim() ?? "";

    if (
      !firstName ||
      !postBody
    ) {
      return NextResponse.json(
        {
          error:
            "Add your first name and something you'd like to share.",
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
      postBody.length > 1500
    ) {
      return NextResponse.json(
        {
          error:
            "Please keep your post under 1500 characters.",
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
        "my_turn_community_posts"
      )
      .insert({
        first_name:
          firstName,
        body:
          postBody,
      })
      .select(
        "id, first_name, body, created_at"
      )
      .single();

    if (error) {
      console.error(
        "Community post save error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Something went wrong while sharing your post. Please try again.",
        },
        {
          status: 500,
        }
      );
    }

    try {
      await sendMyTurnNotification({
        subject: `New My Turn community post — ${firstName}`,
        heading:
          "Someone posted in the My Turn community",
        lines: [
          `Posted by: ${firstName}`,
          "",
          postBody,
        ],
      });
    } catch (emailError) {
      console.error(
        "Community post saved but notification email failed:",
        emailError
      );
    }

    return NextResponse.json({
      success: true,
      post: {
        id:
          data.id,
        firstName:
          data.first_name,
        body:
          data.body,
        createdAt:
          data.created_at,
        replies: [],
      },
    });
  } catch (error) {
    console.error(
      "Community post route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while sharing your post. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}