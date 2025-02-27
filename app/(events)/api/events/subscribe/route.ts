import { sendSubscriptionConfirmation } from "@/app/(events)/actions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateWithZod } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

const subscribeToEventSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const body = await request.json();
    const data = validateWithZod(subscribeToEventSchema, body);
    if (data instanceof NextResponse) return data;
    const event = await prisma.event.update({
      where: { id: data.eventId },
      data: {
        participants: {
          connect: { id: userId },
        },
      },
      include: {
        organizer: true,
      },
    });

    await sendSubscriptionConfirmation(
      session.user.email as string,
      session.user.image as string,
      session.user.name || "",
      event.title,
      event.startAt,
      event.location || "",
      event.id
    );
  } catch (error) {
    console.error("Error subscribing to event:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
