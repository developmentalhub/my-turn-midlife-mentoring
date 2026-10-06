import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { sendMyTurnNotification } from "../../../lib/myTurnEmail";

export const runtime = "nodejs";

type RegistrationBody = {
  firstName?: string;
  email?: string;
  suburb?: string;
  ageRange?: string;
  preferredDays?: string[];
  preferredTimes?: string[];
  betweenSessions?: string[];
  interests?: string[];
  bringSomeone?: string;
  childhoodPlay?: string;
  missNow?: string;
  tryTogether?: string;
  barrier?: string;
  hope?: string;
};

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as RegistrationBody;

    const firstName =
      body.firstName?.trim() ?? "";

    const email =
      body.email?.trim() ?? "";

    if (!firstName || !email) {
      return NextResponse.json(
        {
          error:
            "First name and email are required.",
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
      .from("my_turn_registrations")
      .insert({
        first_name: firstName,
        email,
        suburb:
          body.suburb?.trim() || null,
        age_range:
          body.ageRange || null,
        preferred_days:
          body.preferredDays ?? [],
        preferred_times:
          body.preferredTimes ?? [],
        between_sessions:
          body.betweenSessions ?? [],
        interests:
          body.interests ?? [],
        bring_someone:
          body.bringSomeone || null,
        childhood_play:
          body.childhoodPlay?.trim() ||
          null,
        miss_now:
          body.missNow?.trim() || null,
        try_together:
          body.tryTogether?.trim() ||
          null,
        barrier:
          body.barrier?.trim() || null,
        hope:
          body.hope?.trim() || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error(
        "My Turn registration save error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "We couldn't save your registration. Please try again.",
        },
        {
          status: 500,
        }
      );
    }

    try {
      await sendMyTurnNotification({
        subject: `New My Turn registration — ${firstName}`,
        heading:
          "Someone wants to be part of My Turn",
        lines: [
          `Name: ${firstName}`,
          `Email: ${email}`,

          body.suburb
            ? `Suburb: ${body.suburb}`
            : "",

          body.ageRange
            ? `Age range: ${body.ageRange}`
            : "",

          body.preferredDays?.length
            ? `Preferred days: ${body.preferredDays.join(
                ", "
              )}`
            : "",

          body.preferredTimes?.length
            ? `Preferred times: ${body.preferredTimes.join(
                ", "
              )}`
            : "",

          body.betweenSessions?.length
            ? `Between sessions: ${body.betweenSessions.join(
                ", "
              )}`
            : "",

          body.interests?.length
            ? `Interested in: ${body.interests.join(
                ", "
              )}`
            : "",

          body.bringSomeone
            ? `Would bring someone: ${body.bringSomeone}`
            : "",

          body.childhoodPlay
            ? `What little-her loved: ${body.childhoodPlay}`
            : "",

          body.missNow
            ? `What she misses now: ${body.missNow}`
            : "",

          body.tryTogether
            ? `What she'd like to try together: ${body.tryTogether}`
            : "",

          body.barrier
            ? `What gets in the way: ${body.barrier}`
            : "",

          body.hope
            ? `What she hopes My Turn becomes: ${body.hope}`
            : "",
        ],
      });
    } catch (emailError) {
      console.error(
        "Registration saved but notification email failed:",
        emailError
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
    });
  } catch (error) {
    console.error(
      "My Turn registration route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}