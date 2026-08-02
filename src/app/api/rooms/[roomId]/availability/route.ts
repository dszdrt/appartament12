import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = await params;
    
    // Fetch all future blocked dates for the room
    const availabilities = await db.roomAvailability.findMany({
      where: {
        roomId,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      select: {
        date: true
      }
    });

    return NextResponse.json({ dates: availabilities.map(a => a.date) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
