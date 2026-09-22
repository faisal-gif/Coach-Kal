# Coach Kal — Chatbot Kalistenik di Rumah

Final project *AI Productivity and AI API Integration for Developers* (Hacktiv8 — Maju Bareng AI).

**Target pengguna:** orang yang ingin belajar kalistenik di rumah tanpa alat gym.
**Yang bisa dilakukan chatbot:** menjawab pertanyaan seputar kalistenik (teknik, progresi, set/rep, cedera) dan menyusun jadwal workout mingguan yang bisa dikerjakan di rumah.

## Stack

- Backend: Node.js + Express, `@google/genai`, model `gemini-2.5-flash`
- Frontend: HTML + CSS + Vanilla JS di `public/`, disajikan lewat `express.static`
- Konfigurasi Gemini: `temperature: 0.7` + `systemInstruction` (persona "Coach Kal")

## Cara menjalankan

```bash
npm install
```

Buat file `.env` di root (contoh ada di `.env.example`), isi dengan API key dari https://aistudio.google.com/u/0/api-keys:

```
GEMINI_API_KEY=your_credential_key
```

Jalankan:

```bash
npm start
```

Buka http://localhost:3000

## Endpoint

`POST /api/chat` — percakapan multi-turn.

Request:

```json
{
  "messages": [
    { "role": "user", "text": "Buatkan jadwal kalistenik 3x seminggu untuk pemula" },
    { "role": "model", "text": "..." },
    { "role": "user", "text": "Ganti hari Rabu jadi latihan kaki" }
  ]
}
```

Response:

```json
{ "result": "<jawaban Coach Kal>" }
```

Error: HTTP 400 kalau `messages` bukan array atau kosong, HTTP 500 kalau panggilan ke Gemini gagal.

## Struktur

```
index.js            # central controller: Express + route /api/chat + system instruction
public/index.html   # UI chat
public/script.js    # kirim pesan ke /api/chat, render balasan
public/style.css    # styling
.env                # GEMINI_API_KEY (tidak di-commit)
```
