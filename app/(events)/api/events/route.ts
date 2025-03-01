import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateWithZod } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

const createEventSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    startAt: z.coerce.date({
      required_error: "Start date and time is required",
      invalid_type_error: "Invalid start date format",
    }),
    endAt: z.coerce.date({
      required_error: "End date and time is required",
      invalid_type_error: "Invalid end date format",
    }),
    location: z.string().min(1, "Location is required").max(100, "Location is too long"),
    description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
    isUnlimitedCapacity: z.boolean().default(true),
    isFree: z.boolean().default(true),
    capacityValue: z.number().positive().int().optional(),
    timezone: z.string().min(1, "Timezone is required"),
    imageBase64: z.string().optional(),
    hashtags: z.array(z.string()).default([]),
  })
  .refine(
    (data) =>
      !data.isUnlimitedCapacity ? data.capacityValue !== undefined : true,
    {
      message: "Capacity value is required when capacity is limited",
      path: ["capacityValue"],
    }
  )
  .refine((data) => data.startAt < data.endAt, {
    message: "End time must be after start time",
    path: ["endAt"],
  });

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        hashtags: {
          select: {
            hashtag: true,
            hashtagId: true,
          }
        },
        organizer: {
          select: {
            name: true,
            image: true,
          }
        },
      }
    });
    return NextResponse.json(events.map((e) => {
      const { hashtags, ...event } = e;
      return {
        ...event,
        hashtags: hashtags.map((h) => ({
          id: h.hashtagId,
          title: h.hashtag.name,
        })),
      };
    }));
  } catch (error) {
    console.error("Error listing event:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

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
    const data = validateWithZod(createEventSchema, body);
    if (data instanceof NextResponse) return data;

    const { hashtags, ...eventData } = data;
    const newEvent = await prisma.event.create({
      data: {
        ...eventData,
        organizerId: userId,
        ...(hashtags && hashtags.length > 0
          ? {
              hashtags: {
                create: hashtags.map((tag) => ({
                  hashtag: {
                    connectOrCreate: {
                      where: { name: tag },
                      create: { name: tag },
                    },
                  },
                })),
              },
            }
          : {}),
      },
    });

    return NextResponse.json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
