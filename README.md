# <p align="center"><img src="public/assets/img/KokiMugi.svg" alt="KokiMugi Logo" width="300"></p>

# <p align="center">🍞 KokiMugi: The AI Bakery Experience</p>

<p align="center">
  <strong>Reimagining the art of baking through the lens of Generative AI.</strong><br>
  Built using <b>Gemini 3.1 Pro & Gemini 3.5 Flash Hight</b> for the <b>#JuaraVibeCoding</b> challenge.
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

---

## 📸 Galeri & Preview Tampilan

Untuk menghadirkan pengalaman visual kelas dunia, KokiMugi hadir dengan antarmuka bertema *bakery* yang dirancang secara detail:

### 1. AI Prompt & Kartu Resep Pintar
Halaman pencarian resep bertenaga AI dengan kartu resep interaktif. Setiap kartu dilengkapi sistem tab internal untuk melihat **Info**, **Bahan**, dan **Langkah Pembuatan** secara instan tanpa perlu membuka halaman baru.

<p align="center">
  <img src="public/assets/markdown/recommend.png" alt="AI Prompt & Recipe Cards" width="100%">
</p>

### 2. Modal Detail Resep Premium
Modal resep bergaya buku resep premium (*book-style recipe layout*). Dilengkapi dasbor statistik, grid 2-kolom daftar bahan dengan checkmark minimalis, serta timeline langkah pembuatan yang terstruktur rapi.

<p align="center">
  <img src="public/assets/markdown/modals.png" alt="Recipe Detail Modal Layout" width="100%">
</p>

---

## 🤖 AI-Powered Intelligence

KokiMugi ditenagai oleh model AI tercanggih dari Google untuk memberikan hasil yang presisi dan kreatif:

- **Gemini 2.5 FLash**: Otak di balik sistem rekomendasi resep yang mampu memahami instruksi kompleks dan menghasilkan data JSON terstruktur untuk UI yang dinamis.
- **Gemma 4**: Digunakan untuk eksperimen model lokal dan optimasi prompt yang lebih spesifik pada ranah kuliner.

---

## 📊 System Architecture

Bagaimana KokiMugi bekerja? Berikut adalah alur cerdas dari input pengguna hingga menjadi resep visual:

```mermaid
flowchart TD
    %% Styling Class Definitions
    classDef client fill:#FFF8F0,stroke:#8B5A2B,stroke-width:2px,color:#5C3A21;
    classDef server fill:#F5EBE6,stroke:#A0522D,stroke-width:2px,color:#5C3A21;
    classDef ai fill:#FFF0F5,stroke:#DB7093,stroke-width:2px,color:#4A1525;
    classDef database fill:#E6F2FF,stroke:#4682B4,stroke-width:2px,color:#1C39BB;
    classDef result fill:#FFFDD0,stroke:#DAA520,stroke-width:3px,color:#5C3A21;

    %% Client-Side Layout
    subgraph Client ["💻 Client-Side (Next.js Frontend)"]
        direction TB
        A["👤 User Input Prompt<br><i>(e.g., 'Eclair Cokelat Lumer')</i>"]
        B["🎨 UI Interaction<br><i>(Premium Eclair AI Button Clicked)</i>"]
        C["🔄 Loader & UI State Controller"]
        D["🍱 Recipe Card (Bento Grid Style)"]
        E["📖 Book-Style Modal Details"]
        F["🖼️ Image Proxy Endpoint<br><code>/api/proxy-image</code>"]
        
        A --> B
        B --> C
        F -->|"Serve Local Resource"| D
        F -->|"Serve Local Resource"| E
    end

    %% Server-Side Layout
    subgraph Server ["⚙️ Server-Side (Next.js Server Actions)"]
        direction TB
        ServerAction["⚡ Server Action: <code>generateRecipes(prompt)</code>"]
        GemmaAPI["🧠 Gemma 4 (Google AI Studio)<br><i>(Recipe Text Generator)</i>"]
        JSONValidation["📝 JSON Sanitizer & Parser"]
        ImagePromptGen["🎨 Image Prompt Extractor"]
        
        %% Image Generation Flow with Fallback
        GeminiImageAPI["🔮 Gemini 2.5 Flash<br><i>(Primary Image Generator)</i>"]
        PollinationsAPI["🖼️ Pollinations AI (Flux Model)<br><i>(Fallback Image Generator)</i>"]

        ServerAction -->|"1. Send Prompt + System Context"| GemmaAPI
        GemmaAPI -->|"2. Return Structured JSON"| JSONValidation
        JSONValidation -->|"3. Extract English imagePrompt"| ImagePromptGen
        
        ImagePromptGen -->|"4a. Attempt Generation"| GeminiImageAPI
        GeminiImageAPI -->|"5a. Direct Image URL"| ProxyRequest["🔗 Raw Image URL"]
        
        ImagePromptGen -.->|"4b. Failure Fallback"| PollinationsAPI
        PollinationsAPI -->|"5b. Fallback Flux URL"| ProxyRequest
        
        ProxyRequest -->|"6. Package with Local Proxy"| ServerResponse["📦 Final Combined Recipe Data"]
    end

    %% Flow connections between Subgraphs
    C -.->|"Fetch API Call"| ServerAction
    ProxyRequest -.->|"Bypasses ISP Block"| F
    ServerResponse -.->|"Return JSON Response"| C
    C -->|"Render Content"| D
    D -->|"Click to Open Detail"| E

    %% Class Assignments
    class A,B,C,D,E,F client;
    class ServerAction,JSONValidation,ImagePromptGen,ServerResponse server;
    class GemmaAPI,GeminiImageAPI,PollinationsAPI ai;
    class ProxyRequest database;
    
    %% Diagram Link Styles
    linkStyle default stroke:#8B5A2B,stroke-width:1.5px;
```

---

## ✨ Features

- **🎨 Premium 3D UI & Custom Buttons**: Antarmuka interaktif dengan tombol-tombol bertema kue 3D (Eclair Cokelat dengan toping meses mengkilap, Ice Cream Sandwich, Tiramisu) yang responsif dan memukau.
- **🤖 AI Recipe Crafter**: Konsultasikan ide gila Anda, dan biarkan Gemini meracik komposisi bahan serta teknik yang sempurna.
- **🗂️ Interactive Recipe Cards**: Kartu hasil rekomendasi dengan sistem tab internal (**Info**, **Bahan**, **Langkah**) dan tinggi terstandarisasi untuk kenyamanan membaca.
- **📖 Book-style Recipe Modals**: Modal detail resep premium bergaya buku resep, lengkap dengan visualisasi bahan dan langkah pembuatan.
- **✨ Touchpad-Friendly Gallery**: Galeri inspirasi yang mendukung gesture geser 2-jari touchpad (*native overflow scroll*) dan mouse dragging di komputer desktop secara mulus.
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
