import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { sendMyTurnNotification } from "../../../lib/myTurnEmail";

export const runtime = "nodejs";

const allowedCategories = [
  "play",
  "connection",
  "creative",
  "movement",
  "adventure",
  "quiet",
] as const;

type WallCategory =
  (typeof allowedCategories)[number];

type CommunityWallBody = {
  answer?: string;
  imageUrl?: string | null;
  category?: string;
};

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as CommunityWallBody;

    const answer =
      body.answer?.trim() ?? "";

    const imageUrl =
      body.imageUrl?.trim() || null;

    const category =
      body.category?.trim() ?? "";

    if (
      !answer &&
      !imageUrl
    ) {
      return NextResponse.json(
        {
          error:
            "Write something or add an image first.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !allowedCategories.includes(
        category as WallCategory
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please choose a valid category.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      answer.length > 1500
    ) {
      return NextResponse.json(
        {
          error:
            "Please keep your memory under 1500 characters.",
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
        "my_turn_wall_entries"
      )
      .insert({
        answer:
          answer || "",
        image_url:
          imageUrl,
        category,
      })
      .select(
        "id, answer, image_url, category, created_at"
      )
      .single();

    if (error) {
      console.error(
        "Community Wall save error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Something went wrong while adding your memory. Please try again.",
        },
        {
          status: 500,
        }
      );
    }

    try {
      await sendMyTurnNotification({
        subject:
          "New memory added to the My Turn Community Wall",
        heading:
          "Something new has been added to the Community Wall",
        lines: [
          `Category: ${category}`,
          answer
            ? `Memory: ${answer}`
            : "A handwritten/image memory was added.",
          imageUrl
            ? "An image was included."
            : "",
        ],
      });
    } catch (emailError) {
      console.error(
        "Community Wall entry saved but notification email failed:",
        emailError
      );
    }

    return NextResponse.json({
      success: true,
      entry: {
        id:
          data.id,
        answer:
          data.answer,
        imageUrl:
          data.image_url,
        category:
          data.category,
        createdAt:
          data.created_at,
      },
    });
  } catch (error) {
    console.error(
      "Community Wall route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while adding your memory. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}