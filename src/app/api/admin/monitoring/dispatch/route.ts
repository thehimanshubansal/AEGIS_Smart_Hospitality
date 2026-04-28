import { NextResponse } from "next/server";
import { dispatchVerifiedIntervention } from "@/lib/agents/audit-agent";
import { sendEmergencyAlert } from "@/lib/emergency-service";
import { getRtdb } from "@/lib/firebase";
import { ref, push, set, update } from "firebase/database";

const ALL_STAFF_THREAD_ID = "broadcast-all-staff";

export async function POST(req: Request) {
  try {
    const { insight } = await req.json();

    if (!insight) {
      return NextResponse.json({ error: "Insight data required" }, { status: 400 });
    }

    // Generate the tactical command using the AI dispatcher
    const dispatchData = await dispatchVerifiedIntervention(insight);

    await sendEmergencyAlert({
      type: "custom",
      message: `[FORCE_CAPTURE] ${dispatchData.broadcastMessage}`,
      sender: "AEGIS_COMMAND",
      target: "staff"
    });

    // Also post to Operational Chat (Staff Broadcast)
    try {
      const db = getRtdb();
      const now = new Date().toISOString();
      const messageRef = push(ref(db, `message_events/${ALL_STAFF_THREAD_ID}`));
      
      await set(messageRef, {
        threadId: ALL_STAFF_THREAD_ID,
        kind: "text",
        text: `[TACTICAL_DISPATCH] ${dispatchData.broadcastMessage}`,
        senderRole: "system",
        senderName: "AEGIS_COMMAND",
        senderId: "system",
        createdAt: now,
        publishAt: now,
        scheduled: false
      });

      // Update thread last message
      await update(ref(db, `message_threads/${ALL_STAFF_THREAD_ID}`), {
        updatedAt: now,
        lastMessageText: `[TACTICAL_DISPATCH] ${dispatchData.broadcastMessage}`,
        lastMessageAt: now,
        lastSenderName: "AEGIS_COMMAND"
      });
    } catch (msgError) {
      console.error("[Dispatch API] Failed to post to chat:", msgError);
    }

    return NextResponse.json({ 
      success: true, 
      broadcastMessage: dispatchData.broadcastMessage,
      priority: dispatchData.priority
    });
  } catch (error: any) {
    console.error("[Dispatch API Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
