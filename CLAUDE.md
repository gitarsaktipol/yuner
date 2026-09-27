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
icon-192.png, icon-512.png, icon-512-maskable.png, apple-touch-icon.png  <- ikon PWA
                          (desain "FT" gradasi ungu-pink-biru dengan motif not musik;
                          icon-192/512 = sudut membulat transparan, maskable = huruf diperkecil
                          ke zona aman 80% di atas latar gradasi, apple-touch = kotak penuh)
```

Semua logika JS ada langsung di dalam `index.html` (di dalam satu `<script>` IIFE besar di bagian bawah file). Tidak ada build step, tidak ada bundler — file `index.html` inilah yang langsung di-serve oleh GitHub Pages.

## Hosting & deployment

- Repo GitHub: `gitarsaktipol/yuner` (nama repo masih "yuner", belum diganti walau aplikasinya sudah bernama FerTune — belum diminta untuk diganti)
- Live di: **https://gitarsaktipol.github.io/yuner/** via GitHub Pages (branch `main`, folder root)
- Tidak ada CI/CD, tidak ada build. Push ke `main` = otomatis live dalam 1-3 menit.
- **Setiap kali mengubah `index.html`, `manifest.webmanifest`, atau `sw.js`, WAJIB naikkan nomor versi `CACHE` di `sw.js`** (contoh: `const CACHE = 'fertune-v2';` -> `'fertune-v3';`), kalau tidak, HP yang sudah pernah install PWA-nya tidak akan mengambil perubahan (service worker akan terus menyajikan versi lama dari cache).
- Ferdi mengerjakan lewat PowerShell Windows di folder lokal `D:\YUNER\yuner-pwa`, pakai `git add . && git commit -m "..." && git push` untuk deploy.

## Ajakan pasang aplikasi (install)
- Kartu "Pasang FerTune di HP" di atas halaman (script kecil terpisah di bawah `index.html`, sebelum registrasi service worker). Muncul saat browser mengirim event `beforeinstallprompt` (Chrome/Edge Android & PC); tombol "Pasang" memunculkan dialog install bawaan browser.
- Di iPhone/iPad (tidak ada event itu) kartu berisi petunjuk: Bagikan → "Tambah ke Layar Utama".
- Tidak tampil kalau app sudah dibuka sebagai aplikasi terpasang (`display-mode: standalone`). "Nanti saja" menyembunyikannya 7 hari (`yg.installSnooze`).

## Tiga menu utama (navigasi tab di bawah)

### 1. Tuner gitar
- Deteksi nada real-time dari mikrofon pakai algoritma **YIN** (implementasi sendiri, fungsi `yin()`).
- Jarum penunjuk sharp/flat, petunjuk teks "Kencangkan senar" / "Kendurkan senar", senar yang sudah pas ditandai hijau.
- Mode otomatis (deteksi senar mana yang dibunyikan) atau kunci ke satu senar tertentu.
- Tombol bunyikan nada acuan (referensi) per senar.
- 7 pilihan tuning: Standar, Drop D, turun ½ nada, turun 1 nada, DADGAD, Open G, Open D.
- A4 referensi bisa diatur 430-450 Hz.
- Ada efek suara chime + penanda "sudah pas" setelah nada stabil di zona hijau selama >=1 detik.
- Smoothing pitch pakai median dari histori beberapa sampel + logika penolakan outlier (butuh 2x sampel menyimpang berturut baru dianggap ganti nada, bukan langsung reset di 1 sampel liar) — ini untuk mencegah jarum "lari-lari" karena noise sesaat.

### 2. Latihan baca not
Tampil sebagai not balok ATAU not angka (notasi kepala not Indonesia/jianpu), bisa dipilih pemain sedang pakai **Piano** atau **Gitar** (kalau Gitar, bunyi digeser satu oktaf ke bawah dari not tertulis, sesuai konvensi penulisan gitar).

Empat sumber soal (dropdown "Berlatih secara"):
- **Acak** — soal acak dengan pengaturan kunci (G/F), rentang nada, jumlah not, opsi sertakan nada ♯, opsi abaikan oktaf.
- **Arcade** — 26 huruf (A-Z) x 9 sub-level = 234 level progresif. Level A-C tetap 2 birama; makin ke Z birama bertambah sampai 9. Kesulitan lain (lebar lompatan interval, variasi ritme 1/4-1/8-1/16-titik, peluang nada ♯) ikut naik mengikuti level. Kalau selesai 100% benar: papan not berpendar + bunyi chime + otomatis naik ke sub-level berikutnya (~1.6 detik jeda). Kalau <100%: otomatis mengulang level yang sama.
- **Custom** — pemain pilih sendiri nada mana saja yang boleh muncul lewat grid 36 tombol (3 oktaf, C3-B5), minimal 2 nada harus dipilih, plus pilihan jumlah birama 1-9.
- **Partitur saya** — soal diambil dari partitur yang dibuat sendiri di menu Partitur.

Mekanisme penilaian not yang dimainkan (fungsi `practiceHit`):
- Mikrofon dianalisis tiap 25ms; onset (serangan nada baru) butuh jeda minimum 90ms dari onset sebelumnya; butuh 2x pembacaan pitch stabil berturut baru dikonfirmasi.
- Legato (hammer-on/pull-off/slur tanpa serangan baru) terdeteksi lewat jalur kedua: kalau pitch berubah sementara bunyi masih menyambung (rms di atas ambang), itu juga dianggap not baru.
- **Toleransi salah**: kalau yang terdeteksi salah, 2x percobaan pertama diabaikan diam-diam (bisa jadi cuma sisa dengungan not sebelumnya yang belum sungguh dimainkan). Baru di percobaan ke-3 berturut resmi ditandai "salah", TAPI kursor **tetap di not yang sama** sampai not yang benar sungguh dimainkan (tidak otomatis lanjut walau sudah ditandai salah).
- **Kursor ganda saat main cepat**: kalau jeda antar not-benar <350ms (indikasi main cepat/mengalir), tampilan menunjukkan 2 kursor sekaligus — kursor lama jadi bingkai putus-putus transparan (not yang baru dibunyikan), kursor baru solid merah muda langsung menunjuk not berikutnya (lookahead), supaya mata pemain tidak ketinggalan menunggu app selesai memproses.
- Deteksi lewat mikrofon/kabel masih **monofonik** (satu nada per waktu, via YIN). Untuk banyak nada sekaligus (akor, sampai 10 jari) pakai **keyboard MIDI** (lihat bagian "Sambungkan alat musik").
- Dari MIDI (`practiceHit(m,true)`) penilaian langsung tanpa toleransi 3x, karena nadanya pasti. Selama ada not MIDI dalam 2,5 detik terakhir, mikrofon diabaikan supaya suara synth dari speaker tidak terhitung dua kali.
- Penilaian cuma memeriksa ketepatan **nada**, belum memeriksa **irama/ritme**.

### Sambungkan alat musik (kartu di menu Latihan)
- **Keyboard / controller MIDI** lewat Web MIDI API (`midiConnect`, `midiMessage`): tanpa delay analisis suara, polifonik. Jalan di Chrome/Edge (Android pakai kabel USB OTG, Windows/Mac/Linux). Safari/iPhone belum mendukung Web MIDI. Setelah pernah dihubungkan, otomatis tersambung lagi saat app dibuka (`yg.midi`), dan colok-cabut terdeteksi otomatis.
- Synth polifonik bawaan (`synthOn`/`synthOff`) membunyikan tuts yang ditekan (bisa dimatikan; mendukung pedal sustain CC64).
- Nada yang sedang ditekan + nama akornya (`chordName`, mis. C, Am7, G/B) tampil di papan Latihan dan Partitur.
- Di menu Partitur, tuts MIDI langsung mengisi not (seperti step-input MuseScore). Di Tuner, MIDI hanya menampilkan nama nada.
- **Kabel / jack audio**: pilih input suara (mikrofon bawaan, adaptor jack TRRS, soundcard USB) + "Mode kabel (latensi rendah)": jendela analisis 2048 sampel (~43 ms, bukan 4096/~85 ms), dianalisis tiap 12 ms (bukan 25 ms), minta `latency:0`. Pengaturan disimpan di `yg.audIn` & `yg.direct`.

### 3. Partitur
- Buat partitur sendiri lewat tuts piano di layar: nilai not penuh sampai 1/16, titik (dotted), ♯/♭, rehat, ganti oktaf, pilih & hapus not.
- "Partitur baru" langsung membuat 4 birama berisi rehat kosong (meniru tampilan software notasi seperti MuseScore) dengan kursor menempel di slot kosong pertama. Mengisi not menggeser kursor ke slot kosong berikutnya secara otomatis; setelah 16 slot (4 birama x 4 ketukan) penuh, mode berubah jadi tambah-di-akhir seperti biasa.
- Tombol "Hapus not": mengembalikan not terpilih jadi rehat kosong DI TEMPATNYA (tidak menggeser birama lain/splice array) — supaya struktur grid birama tidak berantakan. Kalau yang dipilih memang slot kosong yang sengaja ditunjuk, baru benar-benar dihapus dari array (mengecilkan birama).
- Bisa diputar dengan suara sintesis, disimpan ke localStorage HP, dikirim ke menu Latihan sebagai sumber soal.
- Bisa unggah gambar partitur sebagai acuan mengetik manual.
- **Ekspor ke MIDI** (`scoreToMidi`, file .mid format 0, PPQ 480, tempo & birama ikut) dan **Impor file MIDI** (`parseMidi` + `midiToScore`): lagu MIDI diubah jadi melodi satu baris (nada tertinggi tiap 1/16, kanal drum 10 dibuang), dikuantisasi ke 1/16, dipotong rapi per birama (tidak ada ikatan/tie, jadi not yang melewati garis birama dipendekkan + rehat), maksimal 600 not. Hasilnya jadi partitur baru yang bisa diputar & dilatih.
- Tombol "Baca otomatis dengan AI" HANYA muncul kalau halaman dibuka dari tautan Claude Artifact (pakai jatah API Claude milik pengguna yang login), untuk membaca melodi satu baris dari gambar — hasilnya perlu dikoreksi manual, bukan 100% akurat.

## Detail rendering notasi

- Not balok (staff notation) dan not angka (numbered/jianpu notation) **digambar sendiri sebagai SVG** dari nol (fungsi `drawScore`, `noteSvg`, `numSvg`) — tidak pakai library notasi musik pihak ketiga (bukan VexFlow/abcjs/dll).
- Not angka: garis panjang (beam) untuk not 1/8 & 1/16 digambar **DI ATAS** angka (bukan di bawah — sempat diminta dipindah), garis-garis pendek yang berdekatan dalam satu ketukan disambung jadi satu garis menerus, bukan garis terpisah per not.
- Titik oktaf di not angka (di atas untuk oktaf tinggi, di bawah untuk oktaf rendah) posisinya menyesuaikan supaya tidak bertabrakan dengan garis beam.
- Kursor/kotak penunjuk di editor Partitur digambar di **ruang kosong setelah** not/slot yang dituju, bukan menimpa langsung notnya — supaya jelas mana yang sudah diisi vs yang akan diisi berikutnya.

## Desain visual

Tema **cerah, ceria, ala Apple** (diminta redesign total dari tema lama yang gelap coklat kayu gitar): latar lavender lembut (`--bg:#F4F6FF`), kartu putih bersih dengan bayangan halus, aksen warna merah muda/coral cerah (`--brass:#FF6F91`), animasi fade-in saat pindah tab, efek tekan (scale down) di semua tombol, tab aktif di navigasi bawah terangkat dengan warna aksen. Mode gelap otomatis mengikuti sistem OS **sengaja dimatikan** (dihapus dari CSS) supaya tema cerah ini yang selalu tampil, apa pun pengaturan HP penggunanya.

Semua warna didefinisikan sebagai CSS custom properties di `:root` (token seperti `--bg`, `--panel`, `--ink`, `--muted`, `--line`, `--brass`, `--ok`, `--bad`, `--warn`, `--hl`, dst) — kalau mau ubah palet warna, ubah di situ, jangan hardcode warna baru di tempat lain.

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
- Halaman Tuner di HP kadang perlu di-scroll karena kontennya lebih tinggi dari layar — sedang dalam proses dipersempit ukurannya (headstock gitar, tuts, dll) supaya muat satu layar tanpa scroll di kebanyakan ukuran HP
