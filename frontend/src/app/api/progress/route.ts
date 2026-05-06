let memory: any[] = [];

export async function GET() {
  try {
    return Response.json({ d: { results: memory } });
  } catch (err) {
    return Response.json(
      { error: "GET failed", details: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // replace existing entry for same island
    memory = memory.filter(
      (x) => x.IslandIndex !== body.IslandIndex
    );

    memory.push(body);

    return Response.json({ ok: true, memory });
  } catch (err) {
    return Response.json(
      { error: "POST failed", details: String(err) },
      { status: 500 }
    );
  }
}