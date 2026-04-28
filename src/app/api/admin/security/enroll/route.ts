import { NextResponse } from 'next/server';
import { createSecurityProfile } from '@/dataconnect-generated';
import { getDataConnectInstance } from '@/lib/firebase';

/**
 * API to enroll a security profile (Staff/Guard/Admin) with biometric data.
 */
export async function POST(req: Request) {
  try {
    const { name, role, photoUrl, referenceId, facialFeatures } = await req.json();

    if (!name || !role || !photoUrl || !referenceId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const dc = getDataConnectInstance();
    const { data } = await createSecurityProfile(dc, {
      referenceId,
      name,
      role,
      photoUrl,
      facialFeatures: facialFeatures || null
    });

    return NextResponse.json({ success: true, result: data });
  } catch (error: any) {
    console.error('Enrollment Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
