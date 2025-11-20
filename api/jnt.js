export default async function handler(req, res) {
  try {
    const { resi } = req.query;

    if (!resi) {
      return res.status(400).json({ error: "Resi tidak boleh kosong" });
    }

    // Pakai fetch bawaan Node 18 (Vercel)
    const url = `https://trace-jtexpress.com/m/track?awb=${resi}`;
    const response = await fetch(url);
    const html = await response.text();

    // Function extract data
    const extract = (label) => {
      const regex = new RegExp(`${label}<\\/span>.*?<span.*?>(.*?)<\\/span>`, "i");
      const match = html.match(regex);
      return match ? match[1].trim() : null;
    };

    const status = extract("Status");
    const origin = extract("Origin");
    const destination = extract("Destination");

    return res.status(200).json({
      resi,
      status: status || "Tidak ditemukan",
      origin: origin || "-",
      destination: destination || "-",
      length: html.length
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server Error",
      detail: err.toString()
    });
  }
}
