import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { designId, eventType, visitorId } = body as {
      designId?: string;
      eventType?: string;
      visitorId?: string;
    };

    if (!designId || !eventType) {
      return NextResponse.json(
        { error: "designId and eventType are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("design_events").insert({
      design_id: designId,
      event_type: eventType,
      visitor_id: visitorId || null,
      metadata: {},
    });

    if (error) {
      console.error("Failed to insert design event:", error);
      return NextResponse.json(
        { error: "Failed to record event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Design events API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
