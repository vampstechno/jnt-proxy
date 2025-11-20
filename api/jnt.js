import fetch from "node-fetch";

export default async function handler(req, res) {
  const { resi } = req.query;

  if (!resi) {
    return res.status(400).json({ error: "Resi tidak boleh kosong" });
  }

  try {
    // Scrape halaman tracking global J&T (tidak diblokir ID)
    const url = `https://trace-jtexpress.com/m/track?awb=${resi}`;

    const response = await fetch(url);
    const html = await response.text();

    // Fungsi extract sederhana
    const extract = (label) => {
      const regex = new RegExp(`${label}<\\/span>.*?<span.*?>(.*?)<\\/span>`, "i");
      const match = html.match(regex);
      return match ? match[1].trim() : "-";
    };

    const status = extract("Status");
    const origin = extract("Origin");
    const destination = extract("Destination");

    return res.status(200).json({
      resi,
      status,
      origin,
      destination,
      raw_length: html.length
    });

  } catch (err) {
    return res.status(500).json({
      error: "Gagal mengambil data",
      detail: err.toString()
    });
  }
}
