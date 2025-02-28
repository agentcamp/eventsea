import { sendSubscriptionConfirmation } from "@/app/(events)/actions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateWithZod } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";

const subscribeToEventSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id || !session.user.email) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const body = await request.json();
    const data = validateWithZod(subscribeToEventSchema, body);
    if (data instanceof NextResponse) return data;
    const subscription = await prisma.eventParticipant.upsert({
      where: {
        eventId_userId: {
          userId,
          eventId: data.eventId,
        },
      },
      create: {
        userId,
        eventId: data.eventId,
        status: "going",
        subscriptionId: nanoid(8),
      },
      update: {},
      include: {
        event: true,
      },
    });

    const { success } = await sendSubscriptionConfirmation({
      user: session.user,
      eventTitle: subscription.event.title,
      eventDate: subscription.event.startAt,
      eventLocation: subscription.event.location,
      subscriptionId: subscription.subscriptionId,
    });

    if (!success) {
      return NextResponse.json(
        { message: "Internal server error." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Subscribed to event successfully" });
  } catch (error) {
    console.error("Error subscribing to event:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const subscriptions = await prisma.eventParticipant.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
