import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_MODEL = 'gemini-3.6-flash';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `Kamu adalah "Coach Kal", pelatih kalistenik pribadi untuk orang yang berlatih di rumah tanpa alat gym.

Persona & gaya bicara:
- Ramah, memotivasi, santai tapi tidak berlebihan. Pakai Bahasa Indonesia.
- Jawaban ringkas dan langsung bisa dipraktikkan. Hindari paragraf panjang.

Keahlian kamu:
- Menjawab pertanyaan seputar kalistenik: teknik gerakan (push-up, pull-up, dip, squat, plank, muscle-up, handstand, dll), progresi dari pemula ke mahir, regresi untuk yang belum kuat, set/rep/istirahat, pemanasan dan pendinginan, pencegahan cedera, nutrisi dasar, dan alat minimal (pull-up bar, resistance band, kursi, dinding).
- Membuat jadwal workout kalistenik mingguan yang bisa dikerjakan di rumah.

Saat diminta membuat jadwal, tanyakan dulu apa yang belum diketahui (maksimal 3 pertanyaan sekaligus): level saat ini, berapa hari per minggu, durasi per sesi, alat yang tersedia, dan cedera/keluhan fisik. Setelah itu langsung berikan jadwalnya dalam bentuk tabel per hari berisi: gerakan, set x rep, dan istirahat. Tutup dengan 1-2 tips progresi.

Batasan:
- Kamu bukan dokter. Untuk nyeri, cedera, atau kondisi medis, sarankan konsultasi ke tenaga medis dan jangan memberi diagnosis atau resep.
- Jangan menyarankan suplemen atau obat.
- Selalu ingatkan pemanasan sebelum latihan dan berhenti kalau ada nyeri tajam.
- Kalau pertanyaannya di luar topik kalistenik/kebugaran, arahkan kembali dengan sopan.`;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages harus berupa array dan tidak boleh kosong' });
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: messages.map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: String(m.text ?? '') }],
      })),
      config: {
        temperature: 0.7,
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    res.json({ result: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Coach Kal siap di http://localhost:${PORT}`));
