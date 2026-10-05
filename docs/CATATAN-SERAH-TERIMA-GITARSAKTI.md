# FerTune → Gitar Sakti: Catatan Serah-Terima

Dokumen ini ditulis untuk **Claude yang menangani website Gitar Sakti** (dan untuk Ferdi). Isinya: apa itu FerTune, kondisinya sekarang, apa yang mau dilakukan, dan apa yang dibutuhkan. Tanggal: 2 Oktober 2026. Versi aplikasi saat ditulis: cache `fertune-v53`.

> Gaya kerja dengan Ferdi: dia **bukan programmer**. Jelaskan dengan bahasa Indonesia yang mudah, kirim screenshot hasil, dan dia biasanya langsung bilang "merge". Dia menguji di HP Android (Chrome, PWA terpasang) dan kadang di PC. Perubahan kecil diulang-ulang dengan screenshot; ikuti detail yang dia lingkari.

---

## 1. Ringkasan singkat

**FerTune** (dulu "Yuner") = aplikasi musik pribadi milik Ferdi, berbentuk **PWA satu file HTML tanpa framework** (HTML+CSS+JS vanilla, semua di `index.html`). Bahasa Indonesia. Bisa dipasang di layar utama HP dan jalan offline.

Tiga menu:
1. **Tuner gitar** (mikrofon, algoritma YIN).
2. **Latihan baca not (sight reading)**: not balok atau not angka, mode Acak/Arcade/Custom/"Partitur saya", dinilai lewat mikrofon, kabel jack, atau keyboard MIDI.
3. **Partitur**: editor partitur sendiri (not balok + not angka), akor, tie, putar, impor/ekspor MIDI, impor gambar (AI, hanya jalan di Claude Artifact).

- Repo: `gitarsaktipol/yuner` (GitHub). Live sekarang: `https://gitarsaktipol.github.io/yuner/` (GitHub Pages dari branch `main`, folder root). Push ke `main` = live dalam 1–3 menit.
- **Tidak ada build step.** Tidak ada bundler. Jangan menambah framework.
- **Aturan wajib:** setiap kali `index.html`, `manifest.webmanifest`, atau `sw.js` berubah, **naikkan versi `CACHE` di `sw.js`** (mis. `fertune-v53` → `fertune-v54`), kalau tidak HP yang sudah memasang PWA tidak akan memuat versi baru.
- Baca `CLAUDE.md` di root repo lebih dulu. Itu ringkasan teknis yang selalu diperbarui.

## 2. Keputusan produk yang sudah diambil

- **Bukan lagi untuk anak-anak.** Target usia **13+** (diputuskan Ferdi, Okt 2026). Di Play Console jangan centang usia di bawah 13; tidak masuk Families policy. Karena itu login/akun, cloud, dan tautan ke website Gitar Sakti **boleh**.
- Tetap wajib: setiap fitur yang mengumpulkan data atau memanggil server luar → perbarui `privacy.html` dan jawaban *Data safety* di Play Console. `privacy.html` sekarang masih menulis "tidak memiliki akun"; **harus diperbarui saat login dirilis**.
- Tema visual (pastel, maskot) dipertahankan walau sasaran sudah 13+.

## 3. Visi: satu komunitas dengan Gitar Sakti

Website **gitarsakti.com** mengajarkan gitar. Ferdi ingin FerTune menjadi bagian dari itu:

- Menu baru di **dasbor** website (nama belum diputuskan; usulan: *Studio Musik*, *Ruang Latihan*, *Gitar Sakti Studio*, *Lab Not*). Untuk **pelanggan maupun pengunjung**.
- Isi menu: **Berlatih sight reading**, **membuat partitur** (balok, angka, **tablatur**), **impor MIDI → partitur**, **impor gambar → partitur** (butuh AI), dan **unduh versi Play Store / Windows** untuk pemakaian lebih fleksibel.
- Satu akun: akun Gitar Sakti = akun FerTune. Partitur tersimpan di cloud sehingga **tidak hilang walau ganti HP**.
- Website mempromosikan FerTune ("download aplikasi FerTune untuk latihan sight reading").

## 4. Yang SUDAH ada di FerTune (ringkas, rinci di `CLAUDE.md`)

- **Notasi digambar sendiri sebagai SVG** (`drawScore`, `noteSvg`, `numSvg`): not balok (kunci G/F, tanda kunci, beam, tie, akor) dan not angka (jianpu, titik, garis balok, akor bersusun).
- **Editor Partitur**: aturan birama (pecah otomatis + tie bila not melebihi sisa ketuk), navigasi kursor ◀ ▲ ▼ ▶, hapus bertahap (not → rehat → kosong), ubah durasi per birama, **akor tahap 1** (maks 6 nada; input layar & keyboard MIDI), putar mulai dari not terpilih, ekspor MIDI, impor MIDI (**hanya melodi** dulu).
- **Latihan**: menu pengaturan + pratinjau 2 birama; tombol "Mulai berlatih" membuka layar penuh (overlay, landscape) berisi partitur, teks Benar/Salah, kartu hasil, "Skor terakhir". Soal otomatis ganti; efek suara naik/turun + tepuk tangan. Mikrofon, kabel jack, atau keyboard MIDI (OTG).
- **Layout**: layar tegak normal; layar miring notasi diperbesar seragam.
- **PWA**: `manifest.webmanifest` (orientation any), `sw.js` (cache-first + update diam-diam; hanya meng-cache same-origin, permintaan lintas-origin **tidak dicegat**).
- **Penyimpanan lokal** (`localStorage`): `yg.scores` (array JSON semua partitur), `yg.curScore`, `yg.mode`, `yg.tuning`, `yg.key`, `yg.inst`, `yg.midi`, `yg.audIn`, `yg.direct`, `yg.durView`, `yg.autoAdv`, `yg.arcLetter`, `yg.arcSub`, `yg.custNotes`, `yg.custMeasures`, `yg.midiSynth`. Partitur disimpan otomatis pada setiap perubahan (`saveScores()`).

### Model data partitur (penting untuk sinkron cloud)

```jsonc
// satu elemen di yg.scores
{
  "id": "s1790000000000",      // string unik
  "title": "Partitur baru",
  "ts": [4, 4],                // sukat
  "bpm": 90,
  "clef": "treble",            // atau "bass"
  "key": 0,                    // 0=C, +n = n kres, -n = n mol (opsional)
  "notes": [
    { "m": 60, "d": 1, "a": "" },                       // not: m=MIDI nada terendah, d=ketukan (1=seperempat), a="#"/"b"/""
    { "m": 60, "d": 4, "a": "", "x": [{"m":64,"a":""},{"m":67,"a":""}] }, // AKOR: m terendah, x = nada lain
    { "m": 65, "d": 1.5, "a": "", "tie": true },        // tersambung ke not berikutnya (nada sama)
    { "m": null, "d": 1, "a": "" },                     // rehat
    { "m": null, "d": 1, "a": "", "e": true }           // slot KOSONG (ruang tetap, tidak digambar/dibunyikan)
  ]
}
```
Tidak ada field `updatedAt` per partitur saat ini. **Untuk sinkron, tambahkan `updatedAt` (ms) saat `saveScores()` mendeteksi perubahan.** Ukuran per partitur biasanya < 100 KB (impor MIDI maks 600 not).

## 5. Temuan tentang infrastruktur Gitar Sakti (hasil pemeriksaan read-only)

- **Vercel**: proyek `gitarsaktipol` (website Gitar Sakti) dan `website-gereja` (proyek lain Ferdi, jangan disentuh), satu team.
- **Supabase** (region `ap-southeast-1`): proyek **"gitarsaktipol's Project"**, ref `addtajuxfoxcaezmkice`, URL `https://addtajuxfoxcaezmkice.supabase.co`. Ini database website Gitar Sakti (data pelanggan nyata!). Proyek lain: `website-gereja` (`okpsozogyriufocgmjzv`) — **bukan untuk FerTune**.
  - Tabel `public`: `profiles` (4 baris), `products`, `curriculum_videos` (63), `orders` (3), `coupons`, `testimonials`, `bank_info`, `site_content`, `custom_pages`, `site_visits`, `landing_pages`, `video_progress`, `payment_methods`. Semua RLS aktif.
  - Ada **trigger `on_auth_user_created` → `handle_new_user()`**: setiap pengguna baru di `auth.users` otomatis dibuatkan baris di `profiles`. Artinya siapa pun yang login lewat FerTune juga jadi anggota di `profiles` (diinginkan untuk "satu komunitas", tapi **cek isi `handle_new_user()` dulu** — mis. apakah mengisi peran/langganan).
  - Kunci API publishable bisa diambil dari dashboard Supabase (jangan taruh *service role key* di klien).
- **Domain**: `gitarsakti.com`.
- **Belum diketahui** (tanyakan ke Ferdi / cek kode website): apakah **login Google** sudah aktif di website; nama **repo GitHub website**; framework website (Next.js?); bagaimana status "langganan" ditentukan (kolom di `profiles`? tabel `orders`?).

## 6. Rencana kerja bertahap

### Tahap 1 — Fondasi (prioritas pertama)
1. **Menyajikan FerTune di `gitarsakti.com/fertune`.** Dua cara (pilih satu):
   - **A. Rewrite Vercel** (disarankan, tanpa menyalin kode): di `vercel.json` website, `{"source":"/fertune/:path*","destination":"https://gitarsaktipol.github.io/yuner/:path*"}`. Dari sisi browser itu *same-origin* sehingga sesi login bisa dibagi, dan pembaruan FerTune otomatis ikut tanpa deploy website. Uji: manifest, service worker (scope `/fertune/`), ikon, font, `privacy.html`.
   - **B. Salin file** FerTune ke `public/fertune/` di repo website (perlu proses sinkron manual atau script).
2. **Menu baru di dasbor** → membuka `/fertune/` (halaman penuh, bukan iframe, supaya bisa dipasang sebagai PWA); beri tautan "← Kembali ke dasbor". Untuk pengunjung yang belum login, tetap bisa memakai FerTune (data lokal) dengan ajakan "masuk untuk menyimpan di cloud".
3. **Tabel cloud** (belum dibuat; hanya usulan — **jangan mengubah tabel yang ada**):
   ```sql
   create table public.fertune_scores (
     user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
     id text not null,
     data jsonb not null,
     updated_at timestamptz not null default now(),
     deleted boolean not null default false,
     primary key (user_id, id),
     check (octet_length(data::text) <= 400000)
   );
   alter table public.fertune_scores enable row level security;
   create policy "fertune_select_own" on public.fertune_scores for select to authenticated using (user_id = auth.uid());
   create policy "fertune_insert_own" on public.fertune_scores for insert to authenticated with check (user_id = auth.uid());
   create policy "fertune_update_own" on public.fertune_scores for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
   create policy "fertune_delete_own" on public.fertune_scores for delete to authenticated using (user_id = auth.uid());
   create index on public.fertune_scores (user_id, updated_at);
   ```
   FerTune **hanya** boleh menyentuh tabel ini (data kursus: `orders`, `bank_info`, dst. tidak boleh terjangkau).
4. **Login & sinkron di FerTune**:
   - Pakai **supabase-js** yang di-*host sendiri* di folder FerTune (jangan CDN, sesuai kebiasaan proyek) dengan **`storageKey` yang sama** dengan website supaya sesi dibagi. (Hindari FerTune me-*refresh token* sendiri secara terpisah dari website: refresh token Supabase berotasi, dua pihak yang me-refresh bisa saling mengeluarkan akun.)
   - Tombol **"Masuk"** (Google) + nama akun + **"Keluar"** di menu Partitur.
   - Algoritma: saat masuk → tarik semua baris cloud, gabung dengan lokal per `id` (**`updatedAt` terbaru menang**); setiap `saveScores()` mendorong partitur yang berubah (debounce ~2 detik); penghapusan memakai `deleted:true` (tombstone). Tanpa login aplikasi **tetap jalan** seperti sekarang (data di HP).
   - Perbarui `privacy.html` (email & partitur dikirim ke server Supabase milik Gitar Sakti, tujuan, penghapusan data) dan jawaban Data safety Play Console.
5. **Login Google** (jika belum aktif): Google Cloud Console → OAuth client (Web) → masukkan Client ID/Secret ke Supabase → Authentication → Providers → Google. Tambahkan `https://gitarsakti.com/**` (dan `https://gitarsaktipol.github.io/**` selama masa transisi) ke **Redirect URLs** & set **Site URL**. Ini langkah yang harus dilakukan Ferdi di dashboard (butuh akun Google & Supabase-nya).

### Tahap 2 — Akor & impor MIDI penuh
- Akor tahap 1 sudah selesai (lihat `CLAUDE.md`). Berikutnya: **impor MIDI berakor** (nada bunyi bersamaan → satu akor; kuantisasi), pilihan **"melodi saja / semua jalur / pilih jalur"**, tie per-nada pada akor. Contoh uji: `Canon_in_C.mid` (3 jalur, 46 birama, hingga 7 nada bersamaan; saat ini hasil impor hanya melodi nada tertinggi).

### Tahap 3 — Tablatur gitar
- Belum ada sama sekali. Perlu: model (`str` senar 1–6 dan `fr` fret per nada, tuning), tampilan 6 garis dengan angka fret, cara input (grid senar × fret), konversi balok ↔ tab (pilih posisi senar/fret terbaik), putar dan ekspor. Usulan model: tambah field opsional `s`/`f` pada tiap nada (dan pada elemen `x`), bila kosong dihitung otomatis dari tuning. Rancang bersama Ferdi sebelum membangun (ini besar).

### Tahap 4 — Impor gambar → partitur (AI)
- Sekarang tombol "Baca otomatis dengan AI" **hanya muncul bila halaman dibuka dari Claude Artifact** (memakai AI milik artifact). Di web biasa **tidak jalan**.
- Rencana: **Vercel serverless function** (mis. `/api/omr`) di website yang (1) memverifikasi JWT Supabase pengguna, (2) membatasi pemakaian per pengguna/hari (tabel kuota), (3) memanggil Anthropic API dengan kunci di *environment variable* server (**jangan pernah di klien**), (4) mengembalikan JSON `{title, clef, timeSignature, tempo, notes:[[pitch,duration],...]}` (format sudah dipakai fungsi `readWithAI` di `index.html`, bisa dipakai ulang prompt-nya). Hasil tetap perlu dikoreksi manual (akurasi bukan 100%). Perlu keputusan **siapa boleh memakai** (mis. hanya pelanggan) dan **anggaran biaya**.

### Tahap 5 — Play Store & Windows
- **Android**: PWABuilder → TWA. Langkah rinci di `playstore/PANDUAN-PLAYSTORE.md`. **Package ID**: dokumen lama memakai `io.github.gitarsaktipol.fertune`; karena sekarang punya domain, **putuskan sebelum rilis pertama** apakah memakai `com.gitarsakti.fertune` (package ID **tidak bisa diganti** setelah dirilis). Verifikasi domain butuh `https://gitarsakti.com/.well-known/assetlinks.json` (di `public/.well-known/` repo website; isi SHA-256 dari PWABuilder & Play Console). Ini menggantikan rencana repo terpisah `gitarsaktipol.github.io`.
- **Windows**: PWABuilder juga menghasilkan paket Windows (MSIX) untuk Microsoft Store (butuh akun Microsoft Partner Center). Alternatif tanpa biaya: pengguna memasang PWA langsung dari Chrome/Edge di PC.
- Isi Play Console: target usia 13+, Data safety (email, partitur), tautan kebijakan privasi.

## 7. Yang dibutuhkan (daftar periksa)

**Dari Ferdi / pemilik akun:**
- [ ] Nama **repo GitHub website** Gitar Sakti dan izin akses untuk Claude.
- [ ] Status **login Google** di website; bila belum, kerjakan langkah §6 Tahap 1 no. 5.
- [ ] **Nama menu** di dasbor.
- [ ] **Aturan akses**: fitur mana gratis untuk pengunjung, mana khusus pelanggan (impor MIDI? impor gambar AI? cadangan cloud?).
- [ ] Cara menentukan **status langganan** di database (kolom/tabel mana).
- [ ] **Anggaran & kunci API Anthropic** untuk Tahap 4 (disimpan sebagai env var Vercel, bukan di repo).
- [ ] Akun **Google Play Console** (sudah ada/belum?), dan bila mau Windows: akun **Microsoft Partner Center**.
- [ ] Keputusan **Package ID** Android (§6 Tahap 5).

**Dari sisi teknis:**
- Akses menjalankan SQL di Supabase `addtajuxfoxcaezmkice` (tabel `fertune_scores` + kebijakan RLS), dan membaca isi fungsi `handle_new_user()`.
- Akses `vercel.json`/repo website untuk rewrite `/fertune` dan menu dasbor.
- Redirect URL & Site URL Supabase menyertakan domain FerTune.

## 8. Risiko dan aturan agar tidak merusak apa pun

1. **Jangan menyentuh data kursus** (`orders`, `bank_info`, `payment_methods`, `profiles` selain lewat pemicu yang sudah ada, dst.). FerTune cukup tabel `fertune_scores` dengan RLS ketat.
2. **Jangan menaruh *service role key*** di klien atau repo. Kunci publishable boleh di klien.
3. **Service worker**: hanya meng-cache same-origin dan mengabaikan permintaan lintas-origin, jadi panggilan ke `*.supabase.co` aman. Jika kode login dihosting di path lain, pastikan tidak ikut ter-cache usang.
4. **Rewrite Vercel**: setelah rewrite, `start_url` dan `scope` di `manifest.webmanifest` bersifat relatif — uji instal PWA dari `/fertune/`. Bila bermasalah, ganti ke cara B (salin file).
5. Refresh-token Supabase berotasi: pakai satu pustaka klien (supabase-js) dengan `storageKey` yang sama di website dan FerTune.
6. Privasi: email/partitur yang dikirim ke Supabase **wajib** tercantum di `privacy.html` dan Data safety.
7. Tiap perubahan file aplikasi → naikkan `CACHE` di `sw.js`.
8. Hindari mengubah perilaku yang sudah disengaja (lihat `CLAUDE.md` — banyak iterasi kecil dari Ferdi, mis. aturan birama, hapus bertahap, titik not angka).

## 9. Batasan/hutang yang diketahui

- Akor: tie pada akor mengikuti nada terendah; Latihan dengan akor menganggap benar bila **salah satu** nada dimainkan; mikrofon tetap monofonik (akor penuh hanya via MIDI).
- Beam di not balok tidak ikut berubah warna (benar/salah) pada Latihan.
- Impor MIDI masih satu melodi (nada tertinggi tiap 1/16), maks 600 not.
- Kunci landscape tanpa mode layar penuh bergantung izin browser; cadangannya CSS memutar layar latihan.
- Belum ada: tablatur, impor gambar di web biasa, login/cloud, metronom, tuner kromatik, tuning ukulele/bass (lihat backlog di `CLAUDE.md`).

## 10. Cara menjalankan/menguji

- Buka `index.html` lewat server statis apa saja (mis. `python3 -m http.server`), tidak perlu build. Parameter `?tab=latih` / `?tab=score` membuka tab langsung.
- Uji otomatis yang dipakai selama ini: Playwright + Chromium (`/opt/pw-browsers/chromium`) dengan skrip kecil untuk klik tombol dan cek isi `localStorage` `yg.scores`, ditambah screenshot untuk Ferdi.
- Alur kerja Git: kerja di branch fitur, buat PR ke `main`, merge setelah Ferdi bilang "merge". Satu perubahan = satu PR kecil.
