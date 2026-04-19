import { NextResponse } from "next/server";

type WaitlistPayload = {
  name?: string;
  email?: string;
  company?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json()) as WaitlistPayload;
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const company = body.company?.trim() || "";

  if (!name || !email) {
    return NextResponse.json(
      { message: "Name and email are required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Please enter a valid email." }, { status: 400 });
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json(
      {
        message:
          "The form is working, but GOOGLE_SCRIPT_URL is not configured yet, so this signup was not forwarded to Google Sheets.",
      },
      { status: 200 },
    );
  }

  try {
    const webhookResponse = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        name,
        email,
        company,
        submittedAt: new Date().toISOString(),
      }),
      cache: "no-store",
    });

    if (!webhookResponse.ok) {
      return NextResponse.json(
        { message: "We could not forward your signup to Google Sheets." },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: "You are on the waitlist. We will be in touch soon." });
  } catch {
    return NextResponse.json(
      { message: "The waitlist is temporarily unavailable. Please try again shortly." },
      { status: 502 },
    );
  }
}
