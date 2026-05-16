# <p align="center"><img src="public/assets/img/KokiMugi.svg" alt="KokiMugi Logo" width="300"></p>

# <p align="center">🍞 KokiMugi: The AI Bakery Experience</p>

<p align="center">
  <strong>Reimagining the art of baking through the lens of Generative AI.</strong><br>
  Built using <b>Gemini 3.1 Pro</b> for the <b>#JuaraVibeCoding</b> challenge.
</p>

---

## 🌟 Overview

**KokiMugi** adalah platform eksplorasi kuliner masa depan yang menggabungkan estetika desain premium dengan kekuatan **Artificial Intelligence**. Kami tidak hanya memberikan resep; kami menciptakan pengalaman visual dan interaktif bagi para pecinta _baking_ untuk meracik mahakarya mereka sendiri.

Aplikasi ini dikembangkan secara penuh menggunakan **Gemini 3.1 Pro**, memastikan setiap baris kode dan elemen desain memiliki kualitas terbaik dan efisiensi tinggi, sejalan dengan semangat **#JuaraVibeCoding**.

<p align="center">
  <img src="public/assets/markdown/mugi.png" alt="Sosok Koki Mugi" width="400">
  <br>
  <i>Inilah sosok Koki Mugi, sang ahli baking yang akan memandu petualangan kuliner Anda.</i>
</p>

### ✨ Preview Output

<p align="center">
  <img src="public/assets/markdown/image.png" alt="KokiMugi Generated Output" width="100%">
  <br>
  <i>Contoh output resep yang dihasilkan oleh kecerdasan Gemini 2.5 Flash.</i>
</p>

---

## 🤖 AI-Powered Intelligence

KokiMugi ditenagai oleh model AI tercanggih dari Google untuk memberikan hasil yang presisi dan kreatif:

- **Gemini 3.1 Pro**: Otak di balik sistem rekomendasi resep yang mampu memahami instruksi kompleks dan menghasilkan data JSON terstruktur untuk UI yang dinamis.
- **Gemma 4**: Digunakan untuk eksperimen model lokal dan optimasi prompt yang lebih spesifik pada ranah kuliner.

---

## 📊 System Architecture

Bagaimana KokiMugi bekerja? Berikut adalah alur cerdas dari input pengguna hingga menjadi resep visual:

```mermaid
graph TD
    A[👤 User Input: 'Eclair Cokelat Lumer'] --> B(🌐 Next.js Frontend)
    B --> C{✨ AI Engine}
    C -->|Prompt Engineering| D[🚀 Gemini 3.1 Pro]
    D -->|Structured JSON| E[🍱 Recipe Crafter]
    E --> F[🎨 Visual UI: 3D Elements & Bento Grid]
    F --> G[🎂 Premium Recipe Output]

    style D fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
    style G fill:#DAA520,stroke:#333,stroke-width:2px,color:#fff
```

---

## ✨ Features

- **🎨 Premium 3D UI**: Antarmuka interaktif dengan tombol-tombol bertema kue (Ice Cream Sandwich, Tiramisu, Macaron) yang responsif dan memukau.
- **🤖 AI Recipe Crafter**: Konsultasikan ide gila Anda, dan biarkan Gemini meracik komposisi bahan serta teknik yang sempurna.
- **🍱 Bento Grid Gallery**: Eksplorasi visual karya kuliner dalam tata letak modern yang terorganisir dengan indah.
- **🌊 Fluid Animations**: Transisi gelombang (_wave_) dan animasi halus menggunakan _Framer Motion_ untuk pengalaman pengguna yang _seamless_.

---

## 🛠️ Tech Stack

| Layer          | Technology                                         |
| :------------- | :------------------------------------------------- |
| **Framework**  | [Next.js 16.2.6](https://nextjs.org/) (App Router) |
| **Language**   | [TypeScript](https://www.typescriptlang.org/)      |
| **Styling**    | [Tailwind CSS v4](https://tailwindcss.com/)        |
| **Animations** | [Framer Motion](https://www.framer.com/motion/)    |
| **AI API**     | Google Gemini SDK                                  |
| **Runtime**    | [Bun](https://bun.sh/)                             |

---

## 🎨 Design System: The Bakery Palette

Desain kami terinspirasi dari kehangatan toko roti di pagi hari:

- **Creamy White**: Melambangkan tepung dan kelembutan krim.
- **Choco Brown**: Kedalaman rasa cokelat premium.
- **Golden Honey**: Warna karamel dan keemasan roti yang matang sempurna.

---

## 🚀 Getting Started

Pastikan Anda memiliki [Bun](https://bun.sh/) terinstal di sistem Anda.

1.  **Clone & Install**:

    ```bash
    git clone https://github.com/username/kokimugi.git
    cd kokimugi
    bun install
    ```

2.  **Environment Setup**:
    Buat file `.env` dan tambahkan `GOOGLE_AI_API_KEY`.

3.  **Run Development**:
    ```bash
    bun run dev
    ```

---

<p align="center">
  <b>#JuaraVibeCoding | KokiMugi Developer Team</b><br>
  <i>"Di mana data bertemu rasa."</i>
</p>
