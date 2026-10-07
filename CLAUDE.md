# FerTune — Ringkasan Proyek

Baca file ini dulu sebelum mengerjakan apa pun di repo ini.

## Apa ini

FerTune (dulu bernama "Yuner") adalah aplikasi musik pribadi milik Ferdi, dalam bentuk PWA (Progressive Web App) **satu file HTML tunggal, tanpa framework** (bukan React/Vue, murni HTML+CSS+JS vanilla dalam satu file). Bahasa antarmuka Indonesia. Bisa di-install ke layar utama HP dan jalan offline lewat service worker.

Nama "FerTune" = Ferdi + Tune.

## Struktur repo

```
index.html            <- SATU-SATUNYA file sumber aplikasi (semua HTML/CSS/JS ada di sini)
manifest.webmanifest  <- metadata PWA (nama, warna tema, ikon)
sw.js                 <- service worker untuk cache offline; CACHE name di dalamnya HARUS
                          dinaikkan versinya (mis. fertune-v2 -> fertune-v3) setiap kali
                          index.html/manifest/sw.js diubah, supaya HP mengambil versi baru
privacy.html          <- Kebijakan Privasi (wajib untuk Play Store); ditautkan dari footer aplikasi
fonts/                <- font Bricolage Grotesque (woff2, subset latin) + OFL.txt; disimpan sendiri,
                          TIDAK memakai Google Fonts (privasi: sebisa mungkin tanpa server pihak ketiga)
playstore/            <- bahan Play Store: PANDUAN-PLAYSTORE.md (langkah upload via PWABuilder/TWA),
                          deskripsi-toko.md, ikon 512, feature graphic 1024x500, screenshot/ (berbingkai),
                          raw/ (screenshot polos, juga dipakai di manifest), assetlinks-template/
                          (templat assetlinks.json; file aslinya ditaruh di repo website Gitar Sakti, bukan di sini)
icon-192.png, icon-512.png, icon-512-maskable.png, apple-touch-icon.png  <- ikon PWA
                          (desain "FT" gradasi ungu-pink-biru dengan motif not musik;
                          icon-192/512 = sudut membulat transparan, maskable = huruf diperkecil
                          ke zona aman 80% di atas latar gradasi, apple-touch = kotak penuh)
```

Semua logika JS ada langsung di dalam `index.html` (di dalam satu `<script>` IIFE besar di bagian bawah file). Tidak ada build step, tidak ada bundler — file `index.html` inilah yang langsung di-serve oleh GitHub Pages.

## Hosting & deployment

- Repo GitHub: `gitarsaktipol/yuner` (nama repo masih "yuner", belum diganti walau aplikasinya sudah bernama FerTune — belum diminta untuk diganti)
- Live di: **https://gitarsaktipol.github.io/yuner/** via GitHub Pages (branch `main`, folder root). Alamat utama sekarang **https://gitarsakti.com/fertune/** (website Gitar Sakti me-rewrite ke alamat GitHub Pages; sesi login terbagi karena same-origin)
- Tidak ada CI/CD, tidak ada build. Push ke `main` = otomatis live dalam 1-3 menit.
- **Setiap kali mengubah `index.html`, `manifest.webmanifest`, atau `sw.js`, WAJIB naikkan nomor versi `CACHE` di `sw.js`** (contoh: `const CACHE = 'fertune-v2';` -> `'fertune-v3';`), kalau tidak, HP yang sudah pernah install PWA-nya tidak akan mengambil perubahan (service worker akan terus menyajikan versi lama dari cache).
- Service worker: precache diambil dengan `cache:'reload'` dan file sendiri dicek ulang dengan `no-cache`, supaya versi baru tidak tersimpan dengan file lama dari cache HTTP GitHub Pages (±10 menit). Saat service worker baru mengambil alih, halaman otomatis dimuat ulang sekali (`controllerchange` di `index.html`), jadi pembaruan langsung terlihat.
- Ikon di layar utama (aplikasi terpasang) diperbarui oleh Android sendiri, bisa sampai ±1 hari; cara cepat: hapus ikon lalu pasang ulang.
- Ferdi mengerjakan lewat PowerShell Windows di folder lokal `D:\YUNER\yuner-pwa`, pakai `git add . && git commit -m "..." && git push` untuk deploy.

## Google Play Store (TWA)
- Rencana: dibungkus jadi aplikasi Android lewat PWABuilder (Trusted Web Activity), package ID **`com.gitarsakti.fertune`** (diputuskan Ferdi, Okt 2026; tidak bisa diganti setelah terbit), host `gitarsakti.com`, start URL `/fertune/`. Langkah lengkap & status di `playstore/PANDUAN-PLAYSTORE.md`.
- Isi aplikasi tetap diambil dari GitHub Pages, jadi update biasa cukup push (tidak perlu upload .aab baru).
- Verifikasi domain butuh `https://gitarsakti.com/.well-known/assetlinks.json` → ditaruh di `public/.well-known/` repo website `gitarsaktipol/gitarsaktipol` (belum dibuat; butuh SHA-256 kunci dari PWABuilder & Play Console). Aplikasi dibuat pertama; Gitar Sakti sendiri BELUM dijadikan aplikasi Play Store (kelas video = produk digital → aturan Play Billing).
- Hapus akun (syarat Play) SUDAH ada: tombol di kartu akun + `hapus-akun.html`, memanggil Edge Function `delete-account` di Supabase (kode di repo website `supabase/functions/delete-account`). Akun dengan pesanan tidak dihapus, hanya data `fertune_scores`.
- **Sasaran pengguna: BUKAN lagi untuk anak-anak (diputuskan Ferdi, Okt 2026)** — target usia di Play Console 13+ (jangan centang usia di bawah 13), tidak masuk Families policy. Karena itu login/akun, penyimpanan cloud, dan tautan ke website Gitar Sakti boleh ditambahkan, TETAPI setiap fitur yang mengumpulkan data atau memanggil server pihak ketiga tetap wajib memperbarui `privacy.html` dan jawaban Data Safety. Rencana: satu komunitas dengan website Gitar Sakti (Vercel proyek `gitarsaktipol` + database Supabase `addtajuxfoxcaezmkice`); akun yang sama, tabel partitur terpisah beraturan keamanan (RLS). Jangan menyentuh tabel data kursus (orders, bank_info, dll.).
- Kunci tanda tangan (`*.keystore`) tidak boleh masuk repo (sudah di `.gitignore`).
- Tombol kembali Android: `goTab()` memakai history (pushState/replaceState) supaya dari Latihan/Partitur "kembali" ke Tuner dulu, baru keluar. Pintasan ikon (manifest `shortcuts`) membuka `./?tab=latih` / `./?tab=score`.

## Menu Pengaturan (tab ke-5, `#tab-set`)
- Isi: kartu **Akun** (Masuk/Daftar/Keluar, dipindah dari Partitur; ID elemen `#acct*` tidak berubah), kartu **Tampilan** (tema), kartu **Bantuan** (panduan per halaman + cara sambung keyboard MIDI via OTG/laptop dan kabel audio), tombol **Kebijakan Privasi**, dan kartu **Hapus akun** (`#acctDelCard`, hanya tampil saat login) di paling bawah.
- Tema (`yg.theme` = `warna` default | `dark` | `laut`): atribut `data-theme` di `<html>`, dipasang oleh skrip kecil di `<head>` sebelum halaman digambar (tanpa kedip) dan oleh `applyTheme()`. Semua warna lewat CSS custom properties di `:root` / `:root[data-theme=...]`, termasuk pasangan pastel `--pXxx/--dXxx`, `--navbg`, `--surf`, `--hillTop`. Jangan hardcode warna terang baru; pakai variabel.
- Teks Bantuan harus disesuaikan bila label tombol di Latihan/Partitur berubah (mis. "Sambungkan alat musik", "Hubungkan MIDI", "Mode kabel").

## Ajakan pasang aplikasi (install)
- Kartu "Pasang FerTune di HP" di atas halaman (script kecil terpisah di bawah `index.html`, sebelum registrasi service worker). Muncul saat browser mengirim event `beforeinstallprompt` (Chrome/Edge Android & PC); tombol "Pasang" memunculkan dialog install bawaan browser.
- Di iPhone/iPad (tidak ada event itu) kartu berisi petunjuk: Bagikan → "Tambah ke Layar Utama".
- Tidak tampil kalau app sudah dibuka sebagai aplikasi terpasang (`display-mode: standalone`). "Nanti saja" menyembunyikannya 7 hari (`yg.installSnooze`).

## Menu utama (navigasi tab di bawah: Tuner, Latihan, **Arcade**, Partitur)

**Menu Arcade** (`#tab-arcade`, `renderArcade`, `startArcade`) adalah menu tersendiri seperti game dengan 3 langkah: 1) pilih karakter (pemain, maks. 5, level masing-masing; baru/hapus/ganti nama), 2) pilih Piano atau Gitar, 3) pilih Not balok atau Not angka lalu ▶ PLAY (ada "Ganti level"). Arcade TIDAK lagi ada di dropdown "Berlatih secara" Latihan; `pr.src='arcade'` hanya selama sesi Arcade berjalan (`startArcade` mengisinya, `closePractice` mengembalikan ke `pr.prevSrc` dan kembali ke langkah 3). Mesin latihan (overlay `#pplay`, penilaian, nilai besar, halaman bukit) dipakai bersama dengan Latihan. Query `?tab=arcade` didukung.

### 1. Tuner gitar
- Deteksi nada real-time dari mikrofon pakai algoritma **YIN** (implementasi sendiri, fungsi `yin()`).
- Jarum penunjuk sharp/flat, petunjuk teks "Kencangkan senar" / "Kendurkan senar", senar yang sudah pas ditandai hijau.
- Mode otomatis (deteksi senar mana yang dibunyikan) atau kunci ke satu senar tertentu.
- Tombol bunyikan nada acuan (referensi) per senar.
- 7 pilihan tuning: Standar, Drop D, turun ½ nada, turun 1 nada, DADGAD, Open G, Open D.
- A4 referensi bisa diatur 430-450 Hz.
- **Senar pas** (stabil di ±5 cent selama >0,7 detik, `stringTuned()`): bunyi "ting" lonceng (`ting()`, nada senar +2 oktaf), getar HP 60 ms, tulisan "Senar N sudah pas! ✓", pasak jadi hijau. **Keenam senar pas**: lagu kecil (`successChime`) + confetti + getar panjang + "Semua senar sudah pas! 🎉". Selama bunyi ting, analisis mikrofon dijeda (`toneUntil`) supaya ting tidak terbaca sebagai nada gitar. AudioContext dinyalakan di tombol "Aktifkan mikrofon" (`micStart` → `ac()`), karena browser HP memblokir bunyi yang tidak dimulai dari sentuhan.
- **Muat satu layar tanpa scroll** (diuji 360x640 s/d 412x915): ukuran huruf nada, jarum, tombol, pasak senar (`--pg`) & kepala gitar memakai `clamp(..vh..)` mengikuti tinggi layar. Di layar < 700 px tinggi (`@media (max-height:700px)`) label "Terlalu rendah/Pas/Terlalu tinggi" disembunyikan & judul diperkecil. Teks petunjuk dan tombol dibuat pendek (1 baris / 2 baris) — kalau menambah elemen di Tuner, cek ulang supaya tetap muat.
- Smoothing pitch pakai median dari histori beberapa sampel + logika penolakan outlier (butuh 2x sampel menyimpang berturut baru dianggap ganti nada, bukan langsung reset di 1 sampel liar) — ini untuk mencegah jarum "lari-lari" karena noise sesaat.

### 2. Latihan baca not
Tampil sebagai not balok ATAU not angka (notasi kepala not Indonesia/jianpu), bisa dipilih pemain sedang pakai **Piano** atau **Gitar** (kalau Gitar, bunyi digeser satu oktaf ke bawah dari not tertulis, sesuai konvensi penulisan gitar).

Empat sumber soal (dropdown "Berlatih secara"):
- **Acak** — soal acak dengan pengaturan kunci (G/F), rentang nada, jumlah not, opsi sertakan nada ♯, opsi abaikan oktaf.
- **Arcade** — 26 huruf (A-Z) x 9 sub-level = 234 level progresif. Level A-C tetap 2 birama; makin ke Z birama bertambah sampai 10 (level Y-Z). Urutan kesulitan (`arcLevelParams`): (1) rentang oktaf dulu, huruf A-I: ±5 nada -> 1 -> 2 -> 3 oktaf, dibatasi C3-B5 (`arcRange`, indeks 21..41) supaya not angka cukup SATU titik atas/bawah (tidak pernah dua titik; kunci F maks. C3-C5, gitar mulai E3 tertulis); (2) jarak antar not (interval) makin jauh, huruf J-R: lompatan maks. 1 -> 7 langkah diatonik (`maxStep`); (3) BARU nada ♯ muncul, huruf S-Z (5% -> 50%). Variasi ritme 1/4-1/8-1/16-titik ikut naik mengikuti level. Toleransi salah dari mikrofon: 1x meleset diabaikan, ke-2 berturut ditandai salah. Deteksi serangan (`pdFeed`) hanya menerima serangan baru kalau volume sempat turun (>=40% dari puncak) supaya satu petikan not sama tidak dihitung 3 not. Pojok kanan atas layar berlatih Arcade menampilkan `Stage A4` (`#pstageLbl`); "Skor terakhir" sudah dihapus. Kalau selesai 100% benar: papan not berpendar + bunyi chime + otomatis naik ke sub-level berikutnya (~1.6 detik jeda). Kalau <100%: otomatis mengulang level yang sama.
- **Custom** — pemain pilih sendiri nada mana saja yang boleh muncul lewat grid 36 tombol (3 oktaf, C3-B5), minimal 2 nada harus dipilih, plus pilihan jumlah birama 1-10.
  - **Pemain Arcade** (maks. 5, `yg.arcPlayers` = [{id,name,look,letter,sub,res}], aktif di `yg.arcActive`): tiap pemain/karakter punya level & nilai sendiri sehingga bisa dilanjutkan, atau teman membuat pemain baru mulai dari A1; bisa dihapus (minimal 1 tersisa). `arcSave()` menyimpan level aktif; `yg.arcLetter/arcSub` tetap mencerminkan pemain aktif. Level naik langsung disimpan saat soal 100% selesai.
  - **Halaman bukit** (`showHill`, `hideHill`): HANYA bila nilai di bawah 100% ATAU satu huruf (9 sub-level) baru tamat 100% (selain itu 100% langsung lanjut ke soal/level berikutnya tanpa halaman ini), setelah nilai besar tampil, Arcade menampilkan karakter yang berjalan naik bukit dari level ke level (hingga 9 level terakhir; gunung selalu menanjak ke kanan, tiap huruf punya warna sendiri & makin tinggi makin gelap, langit acak pagi/sore/malam berbintang yang punya catatan, `yg.arcRes` = {indeksLevel: persen terakhir}); nilai tiap level muncul saat dilewati, kalau 100% karakter lanjut ke level berikutnya, kalau <100% berhenti & level diulang. Tiap level yang dilewati berbunyi (`hillDing`, nada naik). **Skor Arcade**: skor total pemain = jumlah persen terakhir tiap level (`arcTotal`, dari `res`); tampil di tengah atas halaman bukit (menghitung naik tiap level dilewati) dan di tengah atas layar berlatih Arcade (`#ptop`). Kalau 9 level satu huruf semuanya 100% (`arcCheckPerfect`): level ke-9 berbunyi meriah (fanfare + tepuk tangan + kembang api + tulisan PERFECT!) dan skor huruf itu ×2 sekali saja (`bonus` per huruf di data pemain, label BONUS ×2). Tombol "Lanjut ▶" melewatkan; `advanceArcadeLevel`/`newRound` dipanggil setelah halaman selesai.
- **Partitur saya** — soal diambil dari partitur yang dibuat sendiri di menu Partitur.

**Tangga nada** (dropdown "Tangga nada" di Mode Latihan, disimpan di `yg.key`, berlaku untuk Acak/Arcade/Custom; untuk "Partitur saya" ikut kunci partiturnya):
- Disimpan sebagai `key` = jumlah ♯ (1..7) atau ♭ (-1..-7), 0 = C. Label pilihan mengikuti jenis notasi: not balok "♯", "♯♯", ... / "♭", "♭♭", ...; not angka "Tangga nada A (1 = A)".
- Not balok: tanda kunci digambar setelah kunci G/F di setiap baris (`drawScore`); ♯/♭ yang sudah diatur tanda kunci tidak digambar lagi di not, nada yang menyimpang dapat ♯/♭/♮ (`accShown`).
- Not angka: angka relatif terhadap nada dasar (`jianpu(n,key)`), "1" tanpa titik = nada dasar di oktaf 4. Header "1 = A".
- Soal Acak/Arcade: huruf not dibuat diatonis lalu dinaikkan/diturunkan sesuai tanda kunci (`keyNote`); opsi ♯ tambahan hanya pada huruf yang tidak diubah tanda kunci. Custom: nada pilihan tetap, ejaannya disesuaikan (`spellIn`).
- Ejaan not: `n.a` = '#'/'b' menentukan huruf (E♯ = F dieja sebagai huruf E, C♭ = B sebagai huruf C) lewat `letterIdx`/`diaOf`.

Mekanisme penilaian not yang dimainkan (fungsi `practiceHit`):
- Mikrofon dianalisis tiap 25ms; onset (serangan nada baru) butuh jeda minimum 90ms dari onset sebelumnya; butuh 2x pembacaan pitch stabil berturut baru dikonfirmasi.
- Legato (hammer-on/pull-off/slur tanpa serangan baru) terdeteksi lewat jalur kedua: kalau pitch berubah sementara bunyi masih menyambung (rms di atas ambang), itu juga dianggap not baru.
- **Toleransi salah**: kalau yang terdeteksi salah, 2x percobaan pertama diabaikan diam-diam (bisa jadi cuma sisa dengungan not sebelumnya yang belum sungguh dimainkan). Baru di percobaan ke-3 berturut resmi ditandai "salah", TAPI kursor **tetap di not yang sama** sampai not yang benar sungguh dimainkan (tidak otomatis lanjut walau sudah ditandai salah).
- Hanya ada SATU sorotan not yang sedang dituju (fitur "dua sorotan/kursor ganda saat main cepat" sudah dihapus karena mengganggu saat dipakai dengan keyboard MIDI/kabel OTG).
- **Alur Latihan (menu vs layar berlatih)**: menu Latihan hanya berisi pengaturan (Piano/Gitar, notasi, Mode Latihan) di area yang bisa digulir, sedangkan pratinjau 2 birama pertama (`previewScore`) + tombol "▶ Mulai berlatih" (`#pgo`) terpaku di bawah, tepat di atas menu navigasi (`#pdock`, `position:fixed`, tidak ikut menggulir; membuka "Mode Latihan" otomatis menggulir halaman ke atas). Tombol Soal baru/Bunyikan nada/Ulangi soal sudah dihapus. Kartu "Sambungkan alat musik" (`#pconn`: MIDI, input suara, mode kabel) tidak ada lagi di menu; ia hidup di dalam overlay sebagai lembar (`#pconnSheet`) yang terbuka lewat tombol "Sambungkan alat musik" di depan partitur. Di layar miring/pendek (landscape, tinggi ≤ 600 px) dock TIDAK terpaku lagi (menutupi pengaturan): `placeDock` memindahkannya ke akhir menu Latihan sebagai blok biasa yang ikut menggulir (kelas `inflow`), sedangkan di layar tegak tetap terpaku di bawah. Menekan Mulai berlatih (`startPractice`) membuka overlay layar penuh `#pplay` (dipindah ke `<body>` supaya menutupi menu bawah), mencoba `screen.orientation.lock('landscape')` TANPA mode layar penuh (`goLandscape`; layar penuh sengaja dihindari karena Chrome selalu menampilkan pemberitahuan "Untuk keluar dari layar penuh..." yang tak bisa disembunyikan; kalau kunci ditolak browser, CSS `@media (orientation:portrait)` memutar overlay 90° sebagai cadangan), dan memindahkan `#pboard` ke dalam overlay. Isi layar berlatih HANYA: partitur penuh (`drawFit`: skala terbesar yang muat di tinggi tempatnya), teks animasi Benar/Salah, kartu hasil (`#psum`), dan "Skor terakhir" (`#plast`); tombol ✕ dan tombol Kembali Android memunculkan dialog "Yakin mau keluar?" (Ya/Tidak, `askQuit`, `#pquit`; selama dialog tampil penilaian dijeda `pr.paused`); hanya "Ya" yang memanggil `closePractice` (keluar & mematikan mikrofon; history `play:1`). PERHATIAN: jangan menaruh variabel lokal `closePractice` di fungsi lain — `micStop()` memanggil `refreshPractice()`, galat di sana membuat keluar macet saat mikrofon aktif. Sebelum bermain (mikrofon belum aktif & MIDI belum tersambung) di kartu partitur ada 2 tombol: "Aktifkan mikrofon" (`#pstart`) dan "Sambungkan alat musik" (`#pmidiGo` -> `midiConnect`); setelah salah satunya aktif tombol hilang. Penilaian (`practiceData`, MIDI) hanya jalan saat `pr.playing`.
- (lama) Tombol mikrofon dulu ada di paling atas menu Latihan; sekarang di layar berlatih. Di SEMUA mode, selesai satu soal -> otomatis ganti soal (`autoT` di `finishRound`). 100% benar: nada naik rendah->tinggi + tepuk tangan buatan (`practiceWin`, `applause`) + confetti, soal baru/level naik setelah ~2,2 detik. Kurang dari 100%: nada turun tinggi->rendah (`practiceMiss`), lalu soal baru setelah ~1,8 detik (Arcade mengulang level yang sama).
- Deteksi lewat mikrofon/kabel masih **monofonik** (satu nada per waktu, via YIN). Untuk banyak nada sekaligus (akor, sampai 10 jari) pakai **keyboard MIDI** (lihat bagian "Sambungkan alat musik").
- Dari MIDI (`practiceHit(m,true)`) penilaian langsung tanpa toleransi 3x, karena nadanya pasti. Selama ada not MIDI dalam 2,5 detik terakhir, mikrofon diabaikan supaya suara synth dari speaker tidak terhitung dua kali.
- Penilaian default cuma memeriksa ketepatan **nada**. **Mode Tempo** (opsional, `pr.tempoOn`/`pr.bpm`, disimpan `yg.tempoOn`/`yg.bpm`; kartu "Tempo" ada di Arcade langkah 3 dan di Mode Latihan): garis pink berjalan melintasi partitur (`tempoAttach`/`tempoMove`/`tempoLoop`, `<line class="tpline">` di dalam SVG, posisi dari `getBBox` tiap not `g[data-i]`), diawali hitung mundur (4 ketuk, 2 ketuk di ronde berikutnya) dan bunyi klik tiap ketukan (mikrofon dibisukan sesaat). Not harus dibunyikan saat garis melewatinya: jendela ±0,2–0,45 ketuk (`tp.win`), kompensasi latensi mikrofon (70 ms mode kabel / 140 ms biasa, 0 untuk MIDI); terlalu cepat diabaikan, terlambat = "Terlewat" (dihitung salah, kursor lanjut sendiri), nada salah di jendela juga lanjut. Mulai otomatis setelah mikrofon/MIDI aktif (`tempoMaybeStart`).

### Sambungkan alat musik (kartu di menu Latihan)
- **Keyboard / controller MIDI** lewat Web MIDI API (`midiConnect`, `midiMessage`): tanpa delay analisis suara, polifonik. Jalan di Chrome/Edge (Android pakai kabel USB OTG, Windows/Mac/Linux). Safari/iPhone belum mendukung Web MIDI. Setelah pernah dihubungkan, otomatis tersambung lagi saat app dibuka (`yg.midi`), dan colok-cabut terdeteksi otomatis.
- Synth polifonik bawaan (`synthOn`/`synthOff`) membunyikan tuts yang ditekan (bisa dimatikan; mendukung pedal sustain CC64).
- Nada yang sedang ditekan + nama akornya (`chordName`, mis. C, Am7, G/B) tampil di papan Latihan dan Partitur.
- Di menu Partitur, tuts MIDI langsung mengisi not (seperti step-input MuseScore). Di Tuner, MIDI hanya menampilkan nama nada.
- **Kabel / jack audio**: pilih input suara (mikrofon bawaan, adaptor jack TRRS, soundcard USB) + "Mode kabel (latensi rendah)": jendela analisis 2048 sampel (~43 ms, bukan 4096/~85 ms), dianalisis tiap 12 ms (bukan 25 ms), minta `latency:0`. Pengaturan disimpan di `yg.audIn` & `yg.direct`.

### 3. Partitur
- Buat partitur sendiri lewat tuts piano di layar: nilai not penuh sampai 1/16, titik (dotted), ♯/♭, rehat, ganti oktaf, pilih & hapus not.
- Tombol "Save/Create" (`#snew`, dulu "Partitur baru"; partitur otomatis tersimpan di HP setiap ada perubahan, tombol ini menyimpan yang sekarang dan membuat satu partitur kosong baru) dimulai kosong tapi sudah menampilkan satu birama selebar sukatnya (mis. 4 ketukan di 4/4) dengan kursor berkedip di awal. Birama terakhir yang belum penuh tetap diberi ruang untuk sisa ketuk, garis birama ada di ujungnya (tidak menempel ke not terakhir).
- Kursor = garis tipis berkedip (`.caret`) di sisi kanan not terakhir/terpilih, seperti kursor Word.
- **Aturan birama** (`fillOrInsert`, `barRemain`, `splitDur`): jumlah ketuk satu birama harus pas sesuai sukat. Birama penuh -> not berikutnya otomatis masuk birama baru. Kalau not melebihi sisa ketuk: muncul peringatan merah (`#salert`, "Penulisan tidak sesuai dengan sisa nilai nada"), not-not hasilnya berkedip merah ~1,8 detik, lalu not dipecah dan disambung dengan **tie** (`note.tie=true` = tersambung ke not berikutnya yang nadanya sama; `tieFrom`/`tieLen`). Not sambungan tidak dibunyikan ulang saat diputar, tidak diminta di Latihan, dan digabung jadi satu not panjang di ekspor MIDI. Rehat yang kelebihan dipecah tanpa tie.
- Di editor Partitur, kalau birama terakhir sudah penuh, `drawScore(...,editor=true)` menambahkan satu birama kosong berikutnya (`extraBar`) dan kursor pindah ke sana — tidak ada lagi garis akhir ganda yang tampak menutup lagu. Garis akhir ganda hanya muncul di tampilan non-editor (Latihan/pratinjau).
- Kursor di rehat (data lama/hasil "Hapus not") + not baru: rehat digantikan, sisa ketuk tetap rehat.
- **Akor** (tahap 1): satu not bisa berisi beberapa nada (maks 6). Penyimpanan: `n.m/n.a` = nada TERENDAH, `n.x` = nada lain `[{m,a}]` (`pitchList`/`setPitchList`); semua kode lama yang hanya melihat `n.m` tetap jalan. Input: setelah menulis nada, sorotan TETAP di not itu (`editing=true`); menekan nada lain = menambah ke akor yang sama, menekan nada yang sudah ada = membuangnya (`toggleChordPitch`); tombol ▶ Kanan = lanjut ke not baru. Saklar "Maju otomatis" (`autoAdv`, `yg.autoAdv`, bawaan mati) mengembalikan perilaku lama (kursor maju sendiri, tanpa akor). Keyboard MIDI: tuts <160 ms dari tuts sebelumnya = satu akor, jeda lebih lama = not baru (`midiScoreNote`). Tombol ▲ Naik / ▼ Turun (juga panah atas/bawah) memilih satu nada di dalam akor (`pitchSel`, ditandai lingkaran/kotak pink); **Hapus not** membuang nada terpilih itu (nada terakhir -> rehat -> kosong seperti biasa). Gambar not balok: kepala bersusun di satu tangkai, sekon digeser ke sisi lain, tangkai dari kepala terjauh (`noteSvg`); not angka: angka bersusun ke atas dengan jarak `GAP`=30 px, tinggi garis balok mengikuti tumpukan tertinggi di kelompok balok (`numSvg`, `runLift`). Diputar bersamaan & ekspor MIDI menulis semua nada; Latihan "Partitur saya": akor dianggap benar kalau SALAH SATU nadanya dimainkan (tahap 1). Belum: impor MIDI berakor (tahap 2), tie per-nada berbeda pada akor.
- **Navigasi & edit** (`navMove`, `selectAt`, `editing`): tombol ◀ Kiri / Kanan ▶ (juga tombol panah keyboard) memindahkan kursor antar not, rehat, dan slot kosong; ketuk not juga memilihnya. Item terpilih berkedip (`.st-blink`) dan tombol-tombol input ikut menyesuaikan nilainya. Saat terpilih: tuts piano = ganti nada (durasi tetap, not tersambung tie ikut), tombol nilai/titik = ganti durasi (`changeDur`: lebih pendek -> sisanya rehat, lebih panjang -> mengambil ruang dari rehat/kosong terdekat di sebelah kanan dalam birama yang sama (tidak harus berdampingan; not di antaranya bergeser ke kanan) lalu rehat/kosong terdekat di sebelah KIRI (not di antaranya bergeser ke kiri, ujung akhir tetap), atau dari ruang kosong di ujung partitur; dicek PER BIRAMA — boleh selama jumlah ketuk birama itu tidak melebihi sukat, kalau tidak ditolak dengan peringatan), ♯/♭ = ganti ejaan, Rehat = jadi rehat. Tanpa item terpilih (mode ketik) kursor berupa garis berkedip.
- **Hapus not bertahap** (`delNote`): not -> rehat -> **kosong** (`{m:null,e:true}`: ruang tetap ada tapi tidak digambar, tidak dibunyikan) -> kalau kosong itu yang paling belakang, dibuang. Tidak pernah menggeser not/birama di sampingnya. Slot kosong/rehat bisa diisi lagi (not baru menggantikan, sisa ketuk jadi rehat).
- Tombol Putar: kalau ada not yang disorot/dipilih (berkedip), diputar mulai dari not itu; kalau tidak ada, dari awal (`playScore`, `startIdx`).
- Bisa diputar dengan suara sintesis, disimpan ke localStorage HP, dikirim ke menu Latihan sebagai sumber soal.
- Bisa unggah gambar partitur sebagai acuan mengetik manual.
- **Ekspor ke MIDI** (`scoreToMidi`, file .mid format 0, PPQ 480, tempo & birama ikut) dan **Impor file MIDI** (`parseMidi` + `midiToScore`): lagu MIDI diubah jadi melodi satu baris (nada tertinggi tiap 1/16, kanal drum 10 dibuang), dikuantisasi ke 1/16, dipotong rapi per birama (tidak ada ikatan/tie, jadi not yang melewati garis birama dipendekkan + rehat), maksimal 600 not. Hasilnya jadi partitur baru yang bisa diputar & dilatih.
- Tombol "Baca otomatis dengan AI" HANYA muncul kalau halaman dibuka dari tautan Claude Artifact (pakai jatah API Claude milik pengguna yang login), untuk membaca melodi satu baris dari gambar — hasilnya perlu dikoreksi manual, bukan 100% akurat.

## Detail rendering notasi

- Not balok (staff notation) dan not angka (numbered/jianpu notation) **digambar sendiri sebagai SVG** dari nol (fungsi `drawScore`, `noteSvg`, `numSvg`) — tidak pakai library notasi musik pihak ketiga (bukan VexFlow/abcjs/dll).
- Not balok: not seperdelapan/seperenambelas yang berurutan dalam SATU ketukan digabung dengan balok (beam) alih-alih bendera terpisah (`gs`/`grp` di `drawScore`; arah tangkai ikut rata-rata posisi nada, balok kedua untuk 1/16; rehat memutus kelompok; beam tidak ikut berubah warna saat state benar/salah).
- Not angka: garis panjang (beam) untuk not 1/8 & 1/16 digambar **DI ATAS** angka (bukan di bawah — sempat diminta dipindah), garis-garis pendek yang berdekatan dalam satu ketukan disambung jadi satu garis menerus, bukan garis terpisah per not.
- Not angka bertitik (mis. 3 bertitik + 2 seperdelapan, `numSvg`): titik dijauhkan dari angka, diletakkan di dekat not berikutnya sejajar dasar angka, dan garis di atas not seperdelapan yang mengikutinya diperpanjang ke kiri sampai tepat di atas titik (`bm.dl`), sesuai tulisan tangan standar not angka.
- Layar lebar/miring (lebar > 600 px): `drawScore` menggambar dengan lebar virtual `W = lebar/scale` lalu SVG diperbesar seragam (`scale` maks 1,9) lewat viewBox — jadi garis, kepala not, dan jarak ikut membesar (bukan hanya melebar ke samping). Layar tegak tidak berubah.
- Garis paranada digambar hanya sampai garis birama terakhir baris itu (`lineEnd` di `drawScore`), bukan sampai tepi layar — supaya di layar lebar/miring tidak tampak ada birama kosong ekstra.
- Titik oktaf di not angka (di atas untuk oktaf tinggi, di bawah untuk oktaf rendah) posisinya menyesuaikan supaya tidak bertabrakan dengan garis beam.
- Kursor/kotak penunjuk di editor Partitur digambar di **ruang kosong setelah** not/slot yang dituju, bukan menimpa langsung notnya — supaya jelas mana yang sudah diisi vs yang akan diisi berikutnya.

## Desain visual

Tema **ceria, lucu, pastel** (dulu ditujukan untuk anak-anak; sekarang sasaran 13+, tampilan dipertahankan). Sebelumnya tema cerah ala Apple, sebelumnya lagi gelap coklat kayu. Mode gelap otomatis mengikuti OS **sengaja dimatikan** supaya tema cerah ini selalu tampil.

- Warna: latar krem-pink `--bg:#FFF7FB` dengan gumpalan gradasi pastel di belakang; aksen utama pink permen `--brass:#FF6FA8` (+ `--brassDeep` untuk bayangan 3D, `--peach`). Palet pastel berpasangan: `--pPink/--dPink`, `--pSky/--dSky`, `--pMint/--dMint`, `--pLemon/--dLemon`, `--pLilac/--dLilac`, `--pPeach/--dPeach` (p = muda untuk latar tombol, d = lebih tua untuk bayangan 3D/aksen).
- Tombol "jelly" 3D: bayangan bawah padat (`box-shadow:0 5px 0 ...`), saat ditekan turun & mengecil lalu memantul balik (`--bounce` cubic-bezier). Tombol `.sound` dalam satu `.row` otomatis beda warna (pink, biru, kuning, mint via nth-child). Tombol utama `.start` gradasi pink→peach dengan kilau yang menyapu; saat mikrofon aktif (`.on`) jadi mint dengan cincin berdenyut.
- Navigasi bawah: dok gelembung melayang; tab aktif berwarna sendiri (Tuner pink, Latihan biru, Partitur mint) dan ikonnya melompat.
- Tuts piano pelangi (warna per nada C-B), pasak senar tuner berwarna pastel berbeda, maskot not musik tersenyum (`.mascot`, SVG inline) di tiap judul, not musik melayang pelan di latar (`.sky`).
- Animasi umpan balik: "Benar!" melompat (`yay`), salah bergoyang (`nope`) lewat kelas `.bump` di `renderPractice`; `confetti()` dipanggil dari `successChime()` (senar pas / soal 100% benar). Semua animasi mati jika pengguna memilih kurangi gerakan (`prefers-reduced-motion`).

Semua warna didefinisikan sebagai CSS custom properties di `:root` — kalau mau ubah palet warna, ubah di situ, jangan hardcode warna baru di tempat lain.

## Gaya kerja & preferensi Ferdi

- Selalu jelaskan perubahan dalam bahasa yang mudah dipahami orang non-teknis (Ferdi bukan programmer, belajar sambil jalan).
- Kalau mengubah `index.html`/`manifest.webmanifest`/`sw.js`, selalu ingatkan untuk menaikkan versi `CACHE` di `sw.js`.
- Ferdi menguji perubahan di HP Android lewat Chrome, PWA yang sudah di-install ke layar utama — jadi setiap saran perbaikan sebaiknya sudah dipikirkan dampaknya di HP (layar kecil, sentuhan jari, mikrofon HP), bukan cuma di desktop.
- Riwayat percakapan sebelumnya (di Claude.ai, bukan Claude Code) berisi banyak sekali iterasi perbaikan bug kecil — kalau Ferdi menyebut sesuatu "seperti dulu" atau merujuk fitur yang sudah ada, baca dulu kode yang relevan di `index.html`, karena kemungkinan besar sudah pernah diperbaiki dan perilakunya sudah disengaja (bukan bug baru).

## Ide/permintaan yang belum dikerjakan (backlog)

- Tuner kromatik (deteksi nada apa saja, bukan cuma 7 tuning gitar yang tersedia)
- Dukungan tuning ukulele dan bass
- Metronom
- Pemeriksaan irama/ritme di menu Latihan (saat ini cuma nada yang diperiksa)
- Deteksi akor / pitch polifonik dari suara (mikrofon/kabel). Lewat MIDI sudah bisa.
- Partitur dengan akor (beberapa not dalam satu ketukan) + latihan akor lewat MIDI — model not saat ini masih satu nada per slot
- Versi native (plugin VST / aplikasi desktop & Android asli, mis. pakai JUCE) untuk latensi audio lebih rendah lagi — PWA sudah jalan di Android & PC lewat Chrome/Edge
