import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { sendMyTurnNotification } from "../../../lib/myTurnEmail";

export const runtime = "nodejs";

function clean(
  value: FormDataEntryValue | null
) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

export async function POST(
  request: NextRequest
) {
  try {
    const formData =
      await request.formData();

    const businessName = clean(
      formData.get("businessName")
    );

    const contactName = clean(
      formData.get("contactName")
    );

    const email = clean(
      formData.get("email")
    );

    const phone = clean(
      formData.get("phone")
    );

    const suburb = clean(
      formData.get("suburb")
    );

    const website = clean(
      formData.get("website")
    );

    const instagram = clean(
      formData.get("instagram")
    );

    const facebook = clean(
      formData.get("facebook")
    );

    const oneSentence = clean(
      formData.get("oneSentence")
    );

    const inspiration = clean(
      formData.get("inspiration")
    );

    const loveAboutBusiness = clean(
      formData.get(
        "loveAboutBusiness"
      )
    );

    const sprinkleMyTurn = clean(
      formData.get(
        "sprinkleMyTurn"
      )
    );

    const gentleInvitation = clean(
      formData.get(
        "gentleInvitation"
      )
    );

    const image =
      formData.get("image");

    if (
      !businessName ||
      !contactName ||
      !email ||
      !suburb ||
      !oneSentence ||
      !inspiration ||
      !loveAboutBusiness ||
      !sprinkleMyTurn ||
      !gentleInvitation
    ) {
      return NextResponse.json(
        {
          error:
            "Please complete all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    let imageUrl:
      | string
      | null = null;

    if (
      image instanceof File &&
      image.size > 0
    ) {
      if (
        !image.type.startsWith(
          "image/"
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Please upload an image file.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        image.size >
        5 * 1024 * 1024
      ) {
        return NextResponse.json(
          {
            error:
              "Please keep the image under 5 MB.",
          },
          {
            status: 400,
          }
        );
      }

      const bucketName =
        "my-turn-local";

      const {
        data: bucketData,
      } =
        await supabaseAdmin.storage.getBucket(
          bucketName
        );

      if (!bucketData) {
        const {
          error:
            bucketCreateError,
        } =
          await supabaseAdmin.storage.createBucket(
            bucketName,
            {
              public: true,
              fileSizeLimit:
                5 * 1024 * 1024,
              allowedMimeTypes: [
                "image/jpeg",
                "image/png",
                "image/webp",
              ],
            }
          );

        if (
          bucketCreateError &&
          !bucketCreateError.message
            .toLowerCase()
            .includes("already exists")
        ) {
          throw bucketCreateError;
        }
      }

      const extension =
        image.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const fileName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const arrayBuffer =
        await image.arrayBuffer();

      const {
        error: uploadError,
      } =
        await supabaseAdmin.storage
          .from(bucketName)
          .upload(
            fileName,
            arrayBuffer,
            {
              contentType:
                image.type,
              upsert: false,
            }
          );

      if (uploadError) {
        throw uploadError;
      }

      const { data } =
        supabaseAdmin.storage
          .from(bucketName)
          .getPublicUrl(
            fileName
          );

      imageUrl =
        data.publicUrl;
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "my_turn_local_applications"
        )
        .insert({
          business_name:
            businessName,
          contact_name:
            contactName,
          email,
          phone:
            phone || null,
          suburb,
          website:
            website || null,
          instagram:
            instagram || null,
          facebook:
            facebook || null,
          one_sentence:
            oneSentence,
          inspiration,
          love_about_business:
            loveAboutBusiness,
          sprinkle_my_turn:
            sprinkleMyTurn,
          gentle_invitation:
            gentleInvitation,
          image_url:
            imageUrl,
          status:
            "pending",
        })
        .select("id")
        .single();

    if (error) {
      console.error(
        "My Turn Local application save error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Something went wrong while submitting your application.",
        },
        {
          status: 500,
        }
      );
    }

    try {
      await sendMyTurnNotification({
        subject: `New My Turn Local application — ${businessName}`,
        heading:
          "A local business wants to join My Turn Local",
        lines: [
          `Business: ${businessName}`,
          `Contact: ${contactName}`,
          `Email: ${email}`,
          `Suburb: ${suburb}`,
          "",
          `What they offer: ${oneSentence}`,
          "",
          `Why they started: ${inspiration}`,
          "",
          `What they love: ${loveAboutBusiness}`,
          "",
          `How they sprinkle in My Turn: ${sprinkleMyTurn}`,
          "",
          `Their invitation: ${gentleInvitation}`,
        ],
      });
    } catch (emailError) {
      console.error(
        "My Turn Local application saved but email failed:",
        emailError
      );
    }

    return NextResponse.json({
      success: true,
      id:
        data.id,
    });
  } catch (error) {
    console.error(
      "My Turn Local route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while submitting your application.",
      },
      {
        status: 500,
      }
    );
  }
}