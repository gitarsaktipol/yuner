# Catatan progres FerTune — 10 Nov 2026 (sesi Cowork, lanjutan)

Catatan ini TIDAK berisi kata sandi, Client secret, atau kunci apa pun. Client ID dan secret Google tersimpan hanya di Supabase.

## Ringkasan singkat

- "Masuk dengan Google" SUDAH AKTIF dan sudah diuji berhasil (A0 sampai A5 selesai).
- Play Console: penyiapan aplikasi 11 dari 12 selesai sebelum Status pedagang. Status pedagang sudah diisi Ferdi (dilaporkan "sudah", belum dicek ulang oleh Claude).
- Menunggu: daftar penguji uji tertutup (minimal 12 email). Ferdi sedang mencari jasa penguji.
- BELUM dikirim ke Google untuk ditinjau. Menunggu perintah "kirim" dari Ferdi.

## Bagian A: Masuk dengan Google

| Langkah | Status | Catatan |
|---|---|---|
| A0 Akses fertune.support | Selesai | Di project Google Cloud "fertune", fertune.support@gmail.com diberi peran **Browser** + **OAuth Config Editor (Beta)**. Peran Owner TIDAK dipakai (atas keputusan Ferdi). Ferdi menyetujui Persyaratan Layanan Google Cloud untuk akun ini sendiri. |
| A1 Nama aplikasi | Selesai | Auth Platform dibuat: FerTune. |
| A2 Layar persetujuan | Selesai | External; email dukungan dan kontak developer fertune.support@gmail.com; beranda https://fertune.gitarsakti.com/ ; privasi https://fertune.gitarsakti.com/privacy.html ; tanpa logo; scope hanya email, profile, openid. Status **In production** (Publish app dikonfirmasi atas izin Ferdi). |
| A3 OAuth client | Selesai | Dibuat dengan akun ferdiancrestianto@gmail.com. Jenis Web application, nama "Supabase FerTune", redirect URI https://addtajuxfoxcaezmkice.supabase.co/auth/v1/callback |
| A4 Supabase | Selesai | Authentication > Sign In / Providers > Google: ENABLED, Client ID dan secret ditempel lewat tombol salin. |
| A5 Uji login | Berhasil | Tombol "Masuk dengan Google" muncul; Ferdi memilih akun sendiri; kartu Akun menampilkan "Masuk sebagai ..." dengan tanda centang. Lalu Keluar ditekan. Toast "Berhasil masuk! 🎉" sudah tidak terlihat saat dicek. |

### Hal penting dari Bagian A
1. **Domain resmi:** supabase.co ditolak Google ("must be a top private domain"). Atas keputusan Ferdi, hanya gitarsakti.com yang disimpan. Google kemudian otomatis menambahkan `addtajuxfoxcaezmkice.supabase.co` dari alamat callback.
2. **Verifikasi merek DITUNDA** (pilihan Ferdi). Status Branding: "branding needs to be verified before it can be shown to users". Akibatnya layar masuk Google bertuliskan "Lanjutkan ke addtajuxfoxcaezmkice.supabase.co", bukan "FerTune". Hanya soal tampilan. Syarat yang belum terpenuhi: gitarsakti.com belum terverifikasi di Google Search Console (akun ferdiancrestianto hanya punya properti blog gitarsharing2.blogspot.co.id), dan domain supabase.co milik Supabase tidak bisa diverifikasi oleh kita.
3. **Verifikasi data (scope):** tidak diperlukan, karena hanya scope dasar.
4. **Izin akun fertune.support:** halaman Data Access ditolak karena kurang izin "Service Usage". Scope disimpan lewat akun ferdiancrestianto. Peran tidak ditambah.
5. **Isian otomatis Chrome:** Chrome milik Ferdi sempat mengisi otomatis kolom Client IDs dan Client Secret di Supabase, serta kolom nama pengguna dan sandi di Play Console, dengan data tersimpan milik akun lain. Semuanya ditimpa sebelum disimpan. Disarankan mematikan isian otomatis untuk situs-situs ini.

## Bagian B: Play Console (app FerTune: Tuner & Belajar Not, ID 4972545126243766996)

| Langkah | Status | Catatan |
|---|---|---|
| B0 Email kontak toko | Selesai | Setelan Store: fertune.support@gmail.com (situs web https://fertune.gitarsakti.com/). Play tidak meminta verifikasi email. |
| B1 Detail login | Selesai, perlu dicek | "Ya", akses penuh; nama pengguna gitarsaktipol+review@gmail.com; instruksi bahasa Inggris dari Ferdi. Sandi diketik Ferdi sendiri. **PERHATIAN:** kolom sandi menampilkan nilai 10 karakter yang sama persis dengan isian otomatis Chrome sebelumnya, bahkan setelah diminta ketik ulang. Mohon Ferdi pastikan itu benar sandi akun gitarsaktipol+review@gmail.com, dan Claude Code diminta menguji login akun itu di aplikasi. |
| B2 Audiens target | Selesai | Hanya 13–15, 16–17, 18+. Karena semua 13+, Play melewati pertanyaan "menarik bagi anak-anak". |
| B3 Keamanan Data | Selesai | Nama, Alamat email, ID pengguna, Histori pembelian, File dan dokumen; terenkripsi saat dikirim; tidak dibagikan; URL hapus akun https://fertune.gitarsakti.com/hapus-akun.html . Atas permintaan Ferdi, metode akun kini mencakup "Nama pengguna dan sandi" + **OAuth**. |
| B4 Status pedagang | Dikerjakan Ferdi | Default "Ya, status pedagang berlaku". URL Persyaratan Layanan opsional. Ferdi melaporkan sudah mengisi; belum dicek ulang. |
| B5 Penguji uji tertutup | MENUNGGU | Butuh minimal 12 penguji. Daftar "Tim LLK" (8 email) sudah ada di akun. Perlu 4+ email Gmail tambahan dari Ferdi (disarankan 14–16 total sebagai cadangan). Daftar belum dibuat dan link ikut serta belum ada. |
| B6 Pengujian lisensi | Selesai | Daftar "Penguji Beli" kini 2 email: gitarsaktipol@gmail.com dan fertune.support@gmail.com. Respons RESPOND_NORMALLY. "Tim LLK" tidak dicentang. |
| B7 Ringkasan publikasi | Dicatat, BELUM dikirim | Semua perubahan Konten aplikasi tercatat, belum dikirim. Tombol "Kirim aplikasi untuk ditinjau" nonaktif sampai langkah dasbor selesai. Pengujian tertutup baru 1 dari 5 langkah (rilis draf sudah dibuat; sisanya: pilih negara, pilih penguji, pratinjau rilis, kirim rilis). |

Pengingat: tombol "Kirim untuk ditinjau" hanya ditekan setelah Ferdi mengetik "kirim".

## Uji tertutup dan jadwal

- Link ikut serta (opt-in): BELUM ADA, menunggu daftar penguji.
- Tanggal mulai uji tertutup: BELUM, menunggu penguji. Hitungan 14 hari baru dimulai setelah minimal 12 penguji ikut serta, dan jumlahnya harus terus terjaga.
- Perkiraan boleh ajukan produksi: tanggal mulai + 14 hari.
- Syarat produksi: rilis uji tertutup dipublikasikan dan minimal 12 penguji ikut serta (sekarang 0).

## Untuk Claude Code (pengembang FerTune)

1. **Uji akun peninjau:** pastikan gitarsaktipol+review@gmail.com bisa masuk lewat Pengaturan > Akun > Masuk, dan Premium aktif, dengan sandi yang sama seperti di Play Console (lihat catatan B1).
2. **Kebijakan privasi** (privacy.html): cek apakah sudah menyebut Masuk dengan Google (email, nama, ID pengguna dari akun Google) supaya cocok dengan Keamanan Data dan layar persetujuan.
3. **Toast "Berhasil masuk! 🎉"** tidak terlihat saat dicek setelah kembali dari Google. Login tetap berhasil. Cek apakah toast tampil cukup lama atau muncul sama sekali.
4. **Verifikasi merek Google (opsional, ditunda):** butuh verifikasi gitarsakti.com di Search Console (catatan DNS) dan penyelesaian masalah domain supabase.co. Bisa dipertimbangkan nanti bila ingin nama FerTune tampil di layar masuk Google. Alternatif: custom domain di Supabase.
5. **Tidak ada penolakan atau peringatan** dari Google atau Play Console sampai saat ini.

## Rahasia

Tidak ada rahasia di catatan ini. File kunci tetap di D:\FerTune app\FerTune\FerTune-RAHASIA seperti catatan sebelumnya.
