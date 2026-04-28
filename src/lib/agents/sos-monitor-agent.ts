// src/lib/agents/sos-monitor-agent.ts
import { GoogleGenAI } from "@google/genai";
import { getRtdb } from "@/lib/firebase";
import { ref, set, push, serverTimestamp } from "firebase/database";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || "",
});

export interface SOSIncidentReport {
  id: string;
  incidentId: string;
  timestamp: number;
  summary: string;
  threatAssessment: string;
  operationalInsights: string[];
  recommendedFollowUp: string;
  agentSignature: string;
  transcript?: string;
}

/**
 * SOS Monitor Agent (Sentinel-02)
 * Monitors SOS sessions and generates comprehensive incident reports.
 */
export async function generateSOSIncidentReport(incidentData: {
  incidentId: string;
  callerName: string;
  location: string;
  transport: string;
  metadata?: any;
  transcript?: string;
}): Promise<SOSIncidentReport> {
  const prompt = `
    You are the Aegis Sentinel Agent (Sentinel-02). 
    Your task is to analyze an emergency SOS event and prepare a tactical incident report.

    INCIDENT CONTEXT:
    - ID: ${incidentData.incidentId}
    - Subject: ${incidentData.callerName}
    - Location: ${incidentData.location}
    - Primary Transport: ${incidentData.transport}
    - Metadata: ${JSON.stringify(incidentData.metadata || {})}
    
    TRANSCRIPT / LOGS:
    ${incidentData.transcript || "No transcript available. Base analysis on metadata."}

    RESPONSE FORMAT (JSON ONLY):
    {
      "summary": "High-level overview of the incident",
      "threatAssessment": "Analysis of the immediate danger and environment",
      "operationalInsights": ["Point 1", "Point 2", "Point 3"],
      "recommendedFollowUp": "What should the management do next?",
      "agentSignature": "SENTINEL-02 // [ENCRYPTED_HASH]"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: prompt }],
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Malformed report JSON");

    const analysis = JSON.parse(jsonMatch[0]);
    const db = getRtdb();
    const reportsRef = ref(db, `incident-reports/${incidentData.incidentId}`);
    
    const report: SOSIncidentReport = {
      id: incidentData.incidentId,
      incidentId: incidentData.incidentId,
      timestamp: Date.now(),
      transcript: incidentData.transcript,
      ...analysis
    };

    await set(reportsRef, report);
    return report;
  } catch (error) {
    console.error("[Sentinel Agent Error]:", error);
    throw error;
  }
}
