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
| Halaman **Kebijakan Privasi** + tautan di aplikasi | ✅ Sudah (`privacy.html`), **email kontak masih perlu diisi** |
| Screenshot HP, gambar fitur 1024×500, ikon 512×512 | ✅ Sudah (folder `playstore/`) |
| Teks halaman toko (nama, deskripsi singkat & lengkap) | ✅ Sudah (`deskripsi-toko.md`) |
| Jawaban formulir Keamanan Data & rating konten | ✅ Sudah (di bawah) |
| Templat file verifikasi domain (`assetlinks.json`) | ✅ Templat siap, **diisi setelah langkah 3** |
| Akun Google Play Developer | ⬜ Kamu (sudah ada kalau LLK diupload dari akun yang sama) |
| Membuat file aplikasi Android (.aab) + kunci tanda tangan | ⬜ Kamu, lewat PWABuilder (langkah 3) |
| Uji tertutup 12 penguji selama 14 hari (khusus akun pribadi baru) | ⬜ Kamu (langkah 7) |

---

## Langkah 1 — Isi email kontak di Kebijakan Privasi

Buka `privacy.html`, cari `[EMAIL KONTAK PENGEMBANG]`, ganti dengan email yang boleh dilihat publik
(Google mewajibkan kontak di kebijakan privasi). Setelah itu naikkan versi `CACHE` di `sw.js`, lalu push.

## Langkah 2 — Pastikan versi terbaru sudah live

Buka `https://gitarsaktipol.github.io/yuner/` dan `https://gitarsaktipol.github.io/yuner/privacy.html`,
pastikan keduanya tampil.

## Langkah 3 — Buat paket Android di PWABuilder

1. Buka **https://www.pwabuilder.com**, masukkan alamat `https://gitarsaktipol.github.io/yuner/`, tekan **Start**.
2. Tekan **Package For Stores** → **Android** → **Generate Package** (pilih opsi *Google Play*).
3. Di **Options / All Settings**, isi seperti ini (yang lain biarkan bawaan):

   | Pengaturan | Isi |
   |---|---|
   | Package ID | `io.github.gitarsaktipol.fertune` ⚠️ **tidak bisa diganti setelah terbit** |
   | App name | `FerTune` |
   | Launcher name | `FerTune` |
   | App version | `1.0.0` |
   | App version code | `1` (naikkan 1 setiap upload versi baru) |
   | Host | `gitarsaktipol.github.io` |
   | Start URL | `/yuner/` |
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
2. Buat repo GitHub baru bernama persis **`gitarsaktipol.github.io`** (publik), aktifkan GitHub Pages
   (Settings → Pages → branch `main`, folder root).
3. Salin isi folder `playstore/assetlinks-template/` ke repo itu (termasuk file `.nojekyll`
   dan folder `.well-known`). Ganti dua baris `GANTI_DENGAN_...` dengan dua SHA-256 di atas.
4. Cek: `https://gitarsaktipol.github.io/.well-known/assetlinks.json` harus menampilkan isi file tersebut.

> Aplikasi FerTune di `/yuner/` tetap berjalan seperti biasa; repo baru ini hanya menambah halaman di alamat utama.

## Langkah 6 — Lengkapi halaman toko & formulir kebijakan

**Listingan toko:** salin dari `deskripsi-toko.md`, upload ikon, gambar fitur, dan 6 screenshot dari folder ini.

**Kebijakan privasi:** `https://gitarsaktipol.github.io/yuner/privacy.html`

**Akses aplikasi:** *Semua fungsi tersedia tanpa akses khusus* (tidak ada login).

**Iklan:** *Tidak, aplikasi saya tidak berisi iklan.*

**Target audiens & konten:** karena pengguna utamanya anak-anak, centang rentang usia yang sesuai
(mis. **6–8, 9–12, 13–15, 16–17, 18+**). Dengan memilih usia anak, aplikasi masuk **Kebijakan Keluarga (Families)** Google.
FerTune sudah memenuhinya: tanpa iklan, tanpa pengumpulan data, tanpa SDK pihak ketiga, tanpa tautan keluar.

**Keamanan data (Data safety):**

| Pertanyaan | Jawaban |
|---|---|
| Apakah aplikasi mengumpulkan atau membagikan jenis data pengguna yang diwajibkan? | **Tidak** |
| Apakah semua data dienkripsi saat transit? | Ya (semua lewat HTTPS) |
| Apakah pengguna dapat meminta data dihapus? | Tidak ada data yang dikumpulkan; data lokal terhapus saat aplikasi di-uninstall |

> Penjelasan: suara mikrofon dan tuts MIDI diproses di perangkat saja dan tidak dikirim, sehingga menurut aturan
> Google tidak termasuk "dikumpulkan". Partitur & pengaturan disimpan di perangkat saja.

**Rating konten (kuesioner IARC):** kategori *Referensi, Pendidikan, atau Utilitas* (bukan game).
Jawab **Tidak** untuk semua pertanyaan tentang kekerasan, seksual, bahasa kasar, obat-obatan, perjudian,
interaksi antar pengguna, berbagi lokasi, dan pembelian digital. Hasilnya biasanya **Semua Umur / 3+**.

**Aplikasi berita / pinjaman / kesehatan / pemerintah:** Tidak.

**Izin:** paket TWA tidak meminta izin mikrofon sendiri; izin mikrofon diminta oleh Chrome di dalam aplikasi
saat tombol "Aktifkan mikrofon" ditekan.

## Langkah 7 — Uji tertutup (khusus akun developer **pribadi** yang dibuat setelah 13 Nov 2023)

Google mewajibkan **minimal 12 penguji** ikut uji tertutup **selama 14 hari berturut-turut** sebelum boleh
mengajukan rilis produksi. Kalau LLK juga akan diupload dari akun yang sama, penguji yang sama bisa ikut
menguji kedua aplikasi sekaligus. Akun organisasi/perusahaan tidak terkena aturan ini.

## Langkah 8 — Ajukan ke produksi

Setelah uji tertutup selesai: **Rilis → Produksi → Buat rilis baru** → pakai `.aab` yang sama (atau versi baru)
→ **Kirim untuk ditinjau**. Peninjauan aplikasi anak-anak bisa memakan beberapa hari.

---

## Memperbarui aplikasi setelah terbit

- **Perubahan tampilan/fitur** (isi `index.html`, dll.): cukup push ke GitHub seperti biasa (dan naikkan `CACHE`).
  Aplikasi di Play Store otomatis ikut berubah, **tidak perlu upload ulang** ke Play Store.
- **Upload `.aab` baru** hanya perlu kalau mengubah nama, ikon peluncur, warna, atau Google meminta
  target Android terbaru (biasanya setahun sekali). Buat lagi di PWABuilder memakai **kunci yang sama**
  (`signing.keystore`) dan **version code** yang lebih besar.
