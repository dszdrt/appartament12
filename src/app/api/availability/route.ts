import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");
  const roomIdParam = searchParams.get("roomId");

  if (!startParam || !endParam) {
    return NextResponse.json({ error: "Missing start or end date" }, { status: 400 });
  }

  const startDate = new Date(startParam);
  const endDate = new Date(endParam);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  // Get total active rooms (if checking all) or check specific room
  const totalRooms = roomIdParam 
    ? 1 
    : await db.room.count({ where: { deletedAt: null, status: 'ACTIVE' } });

  if (totalRooms === 0) {
    return NextResponse.json({ dates: {} });
  }

  // Get all availabilities in the range
  const availabilities = await db.roomAvailability.findMany({
    where: {
      ...(roomIdParam ? { roomId: roomIdParam } : {}),
      date: {
        gte: startDate,
        lte: endDate,
      }
    },
    select: {
      date: true,
      status: true,
    }
  });

  // Group by date
  const countsByDate: Record<string, number> = {};
  const hasMaintenance: Record<string, boolean> = {};

  availabilities.forEach(a => {
    // Standardize date to YYYY-MM-DD
    const dateStr = a.date.toISOString().split('T')[0];
    countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
    if (a.status === 'MAINTENANCE') {
      hasMaintenance[dateStr] = true;
    }
  });

  // Construct response mapping
  const result: Record<string, "available" | "booked" | "maintenance"> = {};
  
  for (const [dateStr, count] of Object.entries(countsByDate)) {
    if (count >= totalRooms) {
      result[dateStr] = "booked"; // Red
    } else if (hasMaintenance[dateStr]) {
      result[dateStr] = "maintenance"; // Orange
    } else {
      // Partial booking -> still "available" overall, or we could return partial
      // But if count > 0 and count < totalRooms, we consider the hotel "available" because rooms can still be booked!
      // If we want to show orange for partial, we could. The prompt says: "Orange -> Maintenance / Blocked"
    }
  }

  return NextResponse.json({ dates: result });
}
