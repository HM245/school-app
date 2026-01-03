import { getPool } from "../../lib/db";

export default async function SearchSchoolPage() {
  const pool = getPool();
  let schools: any[] = [];
  let dbError: any = null;

  try {
    const [rows] = await pool.query(
      `SELECT id, name, address, image_url FROM schools ORDER BY created_at DESC`
    );
    schools = Array.isArray(rows) ? rows : [];
  } catch (err: any) {
    // Do not throw — render a friendly message instead so the app doesn't crash
    console.error("DB query failed:", err);
    dbError = err;
    schools = [];
  }

  return (
    <div className="min-h-screen py-12 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold mb-6 text-black text-center">Schools</h1>

        {dbError ? (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            {dbError?.code === "ER_BAD_DB_ERROR" ? (
              <div>
                <p className="text-sm font-medium text-red-800">Database not found: <span className="font-mono">{process.env.DB_DATABASE || "schools"}</span></p>
                <p className="mt-2 text-sm text-red-700">Create the database and run the schema to add the required tables.</p>
                <pre className="mt-3 bg-gray-100 p-2 rounded text-sm text-gray-800">
                  <code>
                    mysql -u {process.env.DB_USER || "root"} -p -e "CREATE DATABASE IF NOT EXISTS {process.env.DB_DATABASE || "schools"};"
                    {'\n'}mysql -u {process.env.DB_USER || "root"} -p {process.env.DB_DATABASE || "schools"} &lt; db/schema.sql
                  </code>
                </pre>
                <p className="mt-2 text-sm text-gray-700">You can find the schema at <span className="font-mono">db/schema.sql</span>.</p>
              </div>
            ) : (
              <p className="text-sm text-red-700">Unable to connect to the database. Please ensure your MySQL server is running and that DB env vars are configured. ({dbError?.message})</p>
            )}
          </div>
        ) : schools.length === 0 ? (
          <p className="text-gray-600">No schools found.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {schools.map((s: any) => (
              <article key={s.id} className="bg-white rounded-lg shadow hover:shadow-md overflow-hidden">
                <div className="h-48 bg-gray-100">
                  {s.image_url ? (
                    // plain img tag so public images load from /schoolImages
                    <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-medium text-gray-900">{s.name}</h2>
                  <p className="mt-2 text-sm text-gray-600">{s.address}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
