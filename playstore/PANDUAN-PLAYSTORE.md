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
| Halaman **Kebijakan Privasi** + tautan di aplikasi | ✅ Sudah (`privacy.html`, kontak: leslesku@gmail.com) |
| Screenshot HP, gambar fitur 1024×500, ikon 512×512 | ✅ Sudah (folder `playstore/`) |
| Teks halaman toko (nama, deskripsi singkat & lengkap) | ✅ Sudah (`deskripsi-toko.md`) |
| Jawaban formulir Keamanan Data & rating konten | ✅ Sudah (di bawah) |
| Templat file verifikasi domain (`assetlinks.json`) | ✅ Templat siap, **diisi setelah langkah 3** |
| Akun Google Play Developer | ⬜ Kamu (sudah ada kalau LLK diupload dari akun yang sama) |
| Membuat file aplikasi Android (.aab) + kunci tanda tangan | ⬜ Kamu, lewat PWABuilder (langkah 3) |
| Uji tertutup 12 penguji selama 14 hari (khusus akun pribadi baru) | ⬜ Kamu (langkah 7) |

---

## Langkah 1 — Email kontak ✅

Sudah diisi di `privacy.html` dan `deskripsi-toko.md`: **leslesku@gmail.com**.
Pakai email yang sama di Play Console (Listingan toko → Detail kontak).

## Langkah 2 — Pastikan versi terbaru sudah live

Buka `https://gitarsakti.com/fertune/` dan `https://gitarsakti.com/fertune/privacy.html`,
pastikan keduanya tampil (alamat ini disajikan website Gitar Sakti dari repo ini lewat rewrite Vercel,
jadi memperbarui repo ini otomatis memperbarui keduanya).

## Langkah 3 — Buat paket Android di PWABuilder

1. Buka **https://www.pwabuilder.com**, masukkan alamat `https://gitarsakti.com/fertune/`, tekan **Start**.
2. Tekan **Package For Stores** → **Android** → **Generate Package** (pilih opsi *Google Play*).
3. Di **Options / All Settings**, isi seperti ini (yang lain biarkan bawaan):

   | Pengaturan | Isi |
   |---|---|
   | Package ID | `com.gitarsakti.fertune` ⚠️ **tidak bisa diganti setelah terbit** (sudah diputuskan: memakai domain gitarsakti.com) |
   | App name | `FerTune` |
   | Launcher name | `FerTune` |
   | App version | `1.0.0` |
   | App version code | `1` (naikkan 1 setiap upload versi baru) |
   | Host | `gitarsakti.com` |
   | Start URL | `/fertune/` |
   | Theme color / Background color | `#FFF7FB` |
   | Status bar / Nav bar color | `#FFF7FB` |
   | Display mode | Standalone |
   | Orientation | Portrait |
   | Signing key | **Create new** (isi nama & organisasi) |

4. Tekan **Download**. Kamu mendapat file ZIP berisi:
   - `*.aab` → file yang diupload ke Play Store
   - `signing.keystore` + `signing-key-info.txt` → **KUNCI RAHASIA**
   - `assetlinks.json`

> 🔐 **Simpan `signing.keystore` dan `signing-key-info.txt` di tempat aman (mis. Google Drive pribadi + flashdisk).**
> Jangan di-commit ke GitHub. Tanpa kunci ini, versi baru aplikasi tidak bisa diupload.

## Langkah 4 — Buat aplikasi di Play Console

1. **https://play.google.com/console** → **Buat aplikasi**.
2. Nama: `FerTune: Tuner & Belajar Not`, bahasa default: **Indonesia**, jenis: **Aplikasi**, **Gratis**.
3. Buka **Rilis → Pengujian → Pengujian tertutup** (atau **Pengujian internal** untuk mencoba sendiri dulu),
   buat rilis, upload file `.aab` dari langkah 3.
4. Saat ditanya **Penandatanganan aplikasi oleh Play**, pilih **gunakan** (disarankan).

## Langkah 5 — Verifikasi domain supaya tampil layar penuh (tanpa baris alamat)

Tanpa langkah ini aplikasi tetap jalan, tapi di bagian atas akan terlihat **baris alamat browser**.

1. Ambil dua sidik jari SHA-256:
   - Dari `assetlinks.json` di ZIP PWABuilder (kunci upload kamu).
   - Dari **Play Console → Pengujian dan rilis → Integritas aplikasi → Penandatanganan aplikasi**,
     bagian *Sertifikat kunci penandatanganan aplikasi* → **SHA-256**.
2. Berikan kedua SHA-256 itu ke Claude yang mengurus **website Gitar Sakti** (repo `gitarsaktipol/gitarsaktipol`).
   File `public/.well-known/assetlinks.json` ditaruh di repo website itu (bukan repo baru), dengan isi
   dari `playstore/assetlinks-template/` (package: `com.gitarsakti.fertune`) dan dua SHA-256 tadi, lalu di-merge.
3. Cek setelah deploy: `https://gitarsakti.com/.well-known/assetlinks.json` harus menampilkan isi file tersebut
   (dibuka langsung di browser, tanpa pengalihan).

> Catatan: verifikasi ini berlaku untuk seluruh domain `gitarsakti.com`, tapi aplikasi FerTune hanya membuka
> jalur `/fertune/`.

## Langkah 6 — Lengkapi halaman toko & formulir kebijakan

**Listingan toko:** salin dari `deskripsi-toko.md`, upload ikon, gambar fitur, dan 6 screenshot dari folder ini.

**Kebijakan privasi:** `https://gitarsakti.com/fertune/privacy.html`

**Akses aplikasi:** *Semua fungsi tersedia tanpa akses khusus.* Login akun Gitar Sakti bersifat opsional (hanya untuk simpan cloud); semua fitur bisa dipakai tanpa login.

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
> tombol **Hapus akun** di kartu akun menu Partitur, dan halaman web `https://gitarsakti.com/fertune/hapus-akun.html`.
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

## Memperbarui aplikasi setelah terbit

- **Perubahan tampilan/fitur** (isi `index.html`, dll.): cukup push ke GitHub seperti biasa (dan naikkan `CACHE`).
  Aplikasi di Play Store otomatis ikut berubah, **tidak perlu upload ulang** ke Play Store.
- **Upload `.aab` baru** hanya perlu kalau mengubah nama, ikon peluncur, warna, atau Google meminta
  target Android terbaru (biasanya setahun sekali). Buat lagi di PWABuilder memakai **kunci yang sama**
  (`signing.keystore`) dan **version code** yang lebih besar.
