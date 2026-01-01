import { getPool } from "../../../lib/db";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = String(formData.get("name") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();

    // Basic server-side validation
    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // File handling
    let imageUrl: string | null = null;
    const image = formData.get("image") as File | null;
    if (image && typeof image === "object" && (image as any).name) {
      const fileName = `${Date.now()}-${(image as any).name}`.replace(/\s+/g, "-");
      const folder = path.join(process.cwd(), "public", "schoolImages");
      await fs.mkdir(folder, { recursive: true });
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(path.join(folder, fileName), buffer);
      imageUrl = `/schoolImages/${fileName}`;
    }

    const pool = getPool();
    const sql = `INSERT INTO schools (name, address, email, phone, website, image_url) VALUES (?, ?, ?, ?, ?, ?)`;
    await pool.execute(sql, [name, address, email, phone, website || null, imageUrl]);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
