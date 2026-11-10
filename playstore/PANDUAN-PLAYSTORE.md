# Panduan upload FerTune ke Google Play Store

FerTune adalah aplikasi web (PWA). Untuk masuk Play Store, aplikasi ini **dibungkus** menjadi aplikasi Android
dengan teknologi resmi Google bernama **Trusted Web Activity (TWA)**. Cara termudah: pakai situs **PWABuilder**
(buatan Microsoft, gratis). Tidak perlu menulis kode Android.

---

## Status kesiapan

| Syarat | Status |
|---|---|
| Aplikasi bisa di-install (manifest, ikon 192/512, ikon *maskable*) | ✅ Sudah |
| Jalan tanpa internet (service worker) | ✅ Sudah |
| Tidak menghubungi server pihak ketiga (font disimpan di aplikasi) | ✅ Sudah |
| Tombol **kembali** Android berfungsi wajar (ke Tuner dulu, baru keluar) | ✅ Sudah |
| Halaman **Kebijakan Privasi** + tautan di aplikasi | ✅ Sudah (`privacy.html`, kontak: fertune.support@gmail.com) |
| Screenshot HP, gambar fitur 1024×500, ikon 512×512 | ✅ Sudah (folder `playstore/`) |
| Teks halaman toko (nama, deskripsi singkat & lengkap) | ✅ Sudah (`deskripsi-toko.md`) |
| Jawaban formulir Keamanan Data & rating konten | ✅ Sudah (di bawah) |
| Templat file verifikasi domain (`assetlinks.json`) | ✅ Templat siap, **diisi setelah langkah 3** |
| Akun Google Play Developer | ⬜ Kamu (sudah ada kalau LLK diupload dari akun yang sama) |
| Membuat file aplikasi Android (.aab) + kunci tanda tangan | ⬜ Kamu, lewat PWABuilder (langkah 3) |
| Uji tertutup 12 penguji selama 14 hari (khusus akun pribadi baru) | ⬜ Kamu (langkah 7) |

---

## Langkah 1 — Email kontak ✅

Sudah diisi di `privacy.html` dan `deskripsi-toko.md`: **fertune.support@gmail.com**.
Pakai email yang sama di Play Console (Listingan toko → Detail kontak).

## Langkah 2 — Pastikan versi terbaru sudah live

Buka `https://fertune.gitarsakti.com/` dan `https://fertune.gitarsakti.com/privacy.html`,
pastikan keduanya tampil (subdomain ini langsung menunjuk ke GitHub Pages repo ini lewat file `CNAME`;
DNS-nya catatan CNAME `fertune` → `gitarsaktipol.github.io` di Cloudflare, *DNS only*).
Alamat lama `gitarsakti.com/fertune/` dialihkan ke sini.

## Langkah 3 — Buat paket Android di PWABuilder

1. Buka **https://www.pwabuilder.com**, masukkan alamat `https://fertune.gitarsakti.com/`, tekan **Start**.
2. Tekan **Package For Stores** → **Android** → **Generate Package** (pilih opsi *Google Play*).
3. Di **Options / All Settings**, isi seperti ini (yang lain biarkan bawaan):

   | Pengaturan | Isi |
   |---|---|
   | Package ID | `com.gitarsakti.fertune` ⚠️ **tidak bisa diganti setelah terbit** (sudah diputuskan; tetap dipakai walau alamatnya subdomain) |
   | App name | `FerTune` |
   | Launcher name | `FerTune` |
   | App version | `1.0.0` |
   | App version code | `1` (naikkan 1 setiap upload versi baru) |
   | Host | `fertune.gitarsakti.com` |
   | Start URL | `/` |
   | Theme color / Background color | `#FFF7FB` |
   | Status bar / Nav bar color | `#FFF7FB` |
   | Display mode | Standalone |
   | Orientation | **Default / Any** ⚠️ JANGAN "Portrait": layar berlatih & Arcade harus bisa mendatar |
   | Signing key | **Create new** (isi nama & organisasi) |
   | **Play Billing** | ✅ **CENTANG / Enable** (wajib untuk langganan Premium; tanpa ini tombol beli tidak muncul) |

4. Tekan **Download**. Kamu mendapat file ZIP berisi:
   - `*.aab` → file yang diupload ke Play Store
   - `signing.keystore` + `signing-key-info.txt` → **KUNCI RAHASIA**
   - `assetlinks.json`

> 🔐 **Simpan `signing.keystore` dan `signing-key-info.txt` di tempat aman (mis. Google Drive pribadi + flashdisk).**
> Jangan di-commit ke GitHub. Tanpa kunci ini, versi baru aplikasi tidak bisa diupload.

## Langkah 4 — Buat aplikasi di Play Console

1. **https://play.google.com/console** → **Buat aplikasi**.
2. Nama: `FerTune: Tuner & Belajar Not`, bahasa default: **Indonesia**, jenis: **Aplikasi**, **Gratis**.
   (Gratis + langganan Premium di dalam aplikasi nanti. Aplikasi gratis BOLEH menambah pembelian dalam aplikasi kapan saja;
   yang tidak bisa hanyalah mengubah aplikasi gratis menjadi aplikasi berbayar di muka.)
3. Buka **Rilis → Pengujian → Pengujian tertutup** (atau **Pengujian internal** untuk mencoba sendiri dulu),
   buat rilis, upload file `.aab` dari langkah 3.
4. Saat ditanya **Penandatanganan aplikasi oleh Play**, pilih **gunakan** (disarankan).

## Langkah 5 — Verifikasi domain supaya tampil layar penuh (tanpa baris alamat)

Tanpa langkah ini aplikasi tetap jalan, tapi di bagian atas akan terlihat **baris alamat browser**.

1. Ambil dua sidik jari SHA-256:
   - Dari `assetlinks.json` di ZIP PWABuilder (kunci upload kamu).
   - Dari **Play Console → Pengujian dan rilis → Integritas aplikasi → Penandatanganan aplikasi**,
     bagian *Sertifikat kunci penandatanganan aplikasi* → **SHA-256**.
2. Berikan kedua SHA-256 itu ke Claude. File `.well-known/assetlinks.json` ditaruh di **repo ini** (`yuner`,
   folder `.well-known/` di akar repo; `.nojekyll` sudah ada supaya GitHub Pages mau menyajikan folder bertitik),
   isinya dari `playstore/assetlinks-template/.well-known/assetlinks.json` + dua SHA-256 tadi.
3. Cek setelah deploy: `https://fertune.gitarsakti.com/.well-known/assetlinks.json` harus menampilkan isi file
   tersebut (dibuka langsung di browser, tanpa pengalihan).

> Catatan: verifikasi ini hanya untuk subdomain `fertune.gitarsakti.com`; website Gitar Sakti tidak terpengaruh.

## Langkah 6 — Lengkapi halaman toko & formulir kebijakan

**Listingan toko:** salin dari `deskripsi-toko.md`, upload ikon, gambar fitur, dan 6 screenshot dari folder ini.

**Kebijakan privasi:** `https://fertune.gitarsakti.com/privacy.html`

**Detail login (Akses aplikasi):** fitur Premium perlu langganan, jadi berikan akun uji ke peninjau Google:
email **`gitarsaktipol+review@gmail.com`** + kata sandi yang kamu buat sendiri (daftar dulu di FerTune → Pengaturan → Akun → Daftar,
lalu buka link verifikasi yang masuk ke kotak masuk gitarsaktipol@gmail.com). Akun ini sudah diberi Premium lewat tabel `fertune_grants`.
Instruksi (Inggris): *"Open Settings (gear tab) > Account > Masuk, sign in with the account above. Premium is already active on this account, so all features are unlocked."*

**Iklan:** *Tidak, aplikasi saya tidak berisi iklan.*

**Target audiens & konten:** FerTune TIDAK lagi ditujukan untuk anak-anak. Centang hanya **13–15, 16–17, 18+** (JANGAN centang rentang usia di bawah 13) dan jawab "tidak" pada pertanyaan apakah aplikasi menarik bagi anak-anak. Dengan begitu aplikasi tidak masuk **Kebijakan Keluarga (Families)** Google, sehingga login/akun, penyimpanan cloud, dan tautan ke website Gitar Sakti boleh ditambahkan (tetap perbarui `privacy.html` dan jawaban Data safety). Maskot dan warna pastel tidak masalah, selama deskripsi toko tidak menyebut anak-anak.

**Keamanan data (Data safety)** — berubah sejak ada akun & cloud:

| Pertanyaan | Jawaban |
|---|---|
| Apakah aplikasi mengumpulkan atau membagikan jenis data pengguna yang diwajibkan? | **Ya, mengumpulkan** (tidak membagikan ke pihak ketiga) |
| Jenis data yang dikumpulkan | **Info pribadi:** alamat email, nama (opsional), ID pengguna · **Konten buatan pengguna lain / File & dokumen:** partitur yang disimpan di cloud |
| Tujuan | Fungsi aplikasi, manajemen akun |
| Dikumpulkan secara opsional? | Ya, hanya jika pengguna memilih masuk (login opsional) |
| Apakah semua data dienkripsi saat transit? | Ya (HTTPS) |
| Apakah pengguna dapat meminta data dihapus? | **Ya** — wajib disediakan, lihat catatan di bawah |
| Audio mikrofon | Diproses di perangkat, tidak dikumpulkan/dikirim → tidak dicantumkan sebagai data terkumpul |

> ✅ **Hapus akun sudah ada.** Google Play meminta jalur hapus akun di dalam aplikasi *dan* tautan web. Keduanya tersedia:
> tombol **Hapus akun** di kartu akun menu Pengaturan, dan halaman web `https://fertune.gitarsakti.com/hapus-akun.html`.
> Isi tautan web itu di Play Console → Konten aplikasi → Keamanan data → *Hapus akun*.
> Aturannya: akun yang punya pesanan tidak dihapus (riwayat pembelian wajib disimpan), hanya data FerTune di cloud;
> akun tanpa pesanan dihapus seluruhnya. Sebutkan ini di formulir Play Console bila ditanya data yang dipertahankan.

## Langkah 7 — Uji tertutup (khusus akun developer **pribadi** yang dibuat setelah 13 Nov 2023)

Google mewajibkan **minimal 12 penguji** ikut uji tertutup **selama 14 hari berturut-turut** sebelum boleh
mengajukan rilis produksi. Kalau LLK juga akan diupload dari akun yang sama, penguji yang sama bisa ikut
menguji kedua aplikasi sekaligus. Akun organisasi/perusahaan tidak terkena aturan ini.

## Langkah 8 — Ajukan ke produksi

Setelah uji tertutup selesai: **Rilis → Produksi → Buat rilis baru** → pakai `.aab` yang sama (atau versi baru)
→ **Kirim untuk ditinjau**. Peninjauan bisa memakan beberapa hari.

---

## Versi gratis & Premium (diputuskan Ferdi, Nov 2026)

| Gratis | Premium |
|---|---|
| Tuner & Metronome | — |
| Latihan mode **Acak**, tangga nada **C** saja | Semua tangga nada, Custom, Partitur saya |
| Arcade **stage A** (A1–A9) | Huruf B–Z (225 level) |
| Partitur: lagu contoh dilihat & diputar, **Coba menulis 4 birama** | Menulis tanpa batas, simpan, cloud, impor/ekspor, rekam, akor |

- **Update 9 Nov 2026: pembayaran Google Play SUDAH dipasang di kode.** Pembatasan menyala otomatis di aplikasi Play Store
  begitu produk langganan `premium_bulanan` & `premium_tahunan` aktif di Play Console (web tetap terbuka semua).
  Langkah Ferdi: lihat bagian "Membuat produk langganan" di bawah.
- (Catatan lama) Aturannya sudah ada di kode (`TRIAL_BARS`, `freeKeyOk`, `freeLetterOk` di `index.html`), tapi **belum aktif**
  (`GATING_ON=false`): selama pembayaran Google Play belum dipasang, semua fitur terbuka dan kartu harga
  disembunyikan. Uji tampilan versi gratis: buka `?gating=1`.
- **Sebelum menyalakan:** (1) buat produk langganan di Play Console → Monetisasi → Langganan,
  (2) pasang Play Billing lewat Digital Goods API di TWA (PWABuilder: centang *Play Billing*),
  (3) verifikasi pembelian di server (Edge Function Supabase), (4) ganti `isPremium()`, set `GATING_ON=true`,
  hapus "Mode uji". Ini pekerjaan tersendiri setelah aplikasi ada di Play Console.

## Membuat produk langganan (setelah .aab dengan Play Billing diupload)

1. Play Console → **Setelan** → **Profil pembayaran**: buat/hubungkan profil pembayaran (rekening bank untuk menerima uang).
2. Pilih aplikasi FerTune → **Monetisasi** → **Produk** → **Langganan** → **Buat langganan**:
   - ID produk **`premium_bulanan`** (nama: Premium Bulanan) → tambah **paket dasar** (base plan): perpanjangan otomatis, periode **1 bulan**,
     harga **Rp45.000**, centang **"kompatibel dengan versi lama" (backwards compatible)** → **Aktifkan**.
     Tambah **penawaran** (offer): uji coba gratis **1 bulan**, kelayakan "Akuisisi pengguna baru" → **Aktifkan**.
   - ID produk **`premium_tahunan`** (nama: Premium Tahunan) → paket dasar **1 tahun**, **Rp350.000**, backwards compatible, aktifkan;
     penawaran gratis 1 bulan juga.
   - ⚠️ ID produk harus PERSIS seperti itu (huruf kecil, garis bawah). Tidak bisa diganti setelah dibuat.
3. **Setelan → Pengujian lisensi**: tambahkan email Google kamu (dan penguji) supaya bisa mencoba membeli tanpa ditagih.
4. **Akun layanan** (supaya server bisa mencatat & mengakui pembelian):
   1. Buka https://console.cloud.google.com → buat project (mis. "FerTune") → **APIs & Services → Library** → aktifkan **Google Play Android Developer API**.
   2. **IAM & Admin → Service Accounts → Create**: nama `fertune-play`, tanpa peran → Done. Buka akun itu → **Keys → Add key → JSON** → file .json terunduh.
   3. Play Console → **Pengguna dan izin → Undang pengguna baru** → isi email akun layanan (…@….iam.gserviceaccount.com) → izin aplikasi FerTune:
      **Lihat data keuangan** dan **Kelola pesanan dan langganan** → Undang.
   4. Supabase Dashboard → Project Settings → **Edge Functions → Secrets** → Add: nama `GOOGLE_PLAY_SERVICE_ACCOUNT`, nilai = SELURUH isi file .json tadi.
      (JANGAN kirim isi file itu ke chat / GitHub.)
5. Begitu produk aktif, aplikasi Play otomatis menampilkan harga & tombol berlangganan di Pengaturan → Langganan.
   Uji beli dengan akun penguji lisensi, lalu cek Admin Gitar Sakti → Pengaturan → FerTune → Dari Play Store.
6. Perbarui Play Console → **Konten aplikasi → Keamanan data**: tambah jenis data **Info keuangan → Riwayat pembelian**
   (dikumpulkan, tujuan: fungsi aplikasi; tidak dibagikan).

## Masuk dengan Google (opsional, tombol muncul otomatis setelah diaktifkan)

1. https://console.cloud.google.com → pilih project **fertune** → **APIs & Services → OAuth consent screen**:
   jenis **External**, nama aplikasi `FerTune`, email dukungan `fertune.support@gmail.com`, logo (opsional),
   Authorized domains: `gitarsakti.com` dan `supabase.co`, email developer → Simpan → **Publish app** (Production).
2. **APIs & Services → Credentials → Create credentials → OAuth client ID** → jenis **Web application**, nama `Supabase FerTune`.
   **Authorized redirect URIs**: `https://addtajuxfoxcaezmkice.supabase.co/auth/v1/callback` → Create.
   Salin **Client ID** dan **Client secret** (secret = rahasia, jangan dikirim ke chat).
3. Supabase Dashboard → **Authentication → Sign In / Providers → Google** → aktifkan, tempel Client ID & Client secret → Save.
4. Buka FerTune → Pengaturan → Masuk: tombol **Masuk dengan Google** muncul sendiri (tanpa update aplikasi).
   Akun Google dengan email yang sama dengan akun Gitar Sakti yang sudah ada = akun yang sama.

## Memperbarui aplikasi setelah terbit

- **Perubahan tampilan/fitur** (isi `index.html`, dll.): cukup push ke GitHub seperti biasa (dan naikkan `CACHE`).
  Aplikasi di Play Store otomatis ikut berubah, **tidak perlu upload ulang** ke Play Store.
- **Upload `.aab` baru** hanya perlu kalau mengubah nama, ikon peluncur, warna, atau Google meminta
  target Android terbaru (biasanya setahun sekali). Buat lagi di PWABuilder memakai **kunci yang sama**
  (`signing.keystore`) dan **version code** yang lebih besar.
