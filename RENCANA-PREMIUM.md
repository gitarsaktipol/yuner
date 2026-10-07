# Rencana FerTune Gratis + Premium (langganan Google Play)

Dibuat Okt 2026 setelah diskusi dengan Ferdi. Dokumen ini = keputusan + status pengerjaan.

## Keputusan
- Aplikasi Play Store **gratis diunduh**, fitur lengkap lewat **langganan Premium** (Google Play Billing). Aplikasi yang pernah terbit gratis TIDAK bisa diubah jadi berbayar, jadi model ini dipilih sebelum rilis pertama.
- Harga: **Rp45.000 / bulan** atau **Rp350.000 / tahun**, **gratis 1 bulan pertama** (free trial Play). Pakai harga lokal Play (Indonesia dalam rupiah).
- Pembelian HANYA lewat Google Play (Midtrans tidak untuk FerTune: QRIS/VA tidak bisa ditagih otomatis tiap bulan, dan aturan Play mewajibkan Play Billing untuk fitur dalam aplikasi). Versi web FerTune = versi gratis saja. Versi iPhone dikerjakan nanti (App Store punya aturan pembelian sendiri).
- Jangan menautkan/mengajak ke pembelian di luar Play di dalam aplikasi Play Store.

## Pembagian fitur
| Gratis | Premium |
|---|---|
| Tuner, Metronome, Latihan mode Acak | Latihan Arcade, Custom, Partitur saya |
| Partitur: 2 lagu contoh (Mary Had a Little Lamb, Twinkle Twinkle) hanya lihat + putar | Edit lagu, tambah/simpan partitur, akor, impor/ekspor MIDI, impor gambar |
| "Coba menulis": maks 4 birama, 4/4, tidak bisa simpan/ekspor/impor/akor | Simpan di cloud (akun) |
| Pengaturan, Bantuan, tema, hapus akun | |
Partitur buatan pengguna yang sudah ada: tetap bisa dilihat & diputar di versi gratis, tidak bisa diubah. Saat berlangganan, tulisan "Coba menulis" otomatis disimpan jadi partitur biasa (`promoteTrial`).

## Status
- [x] **Fase 1 – Metronome** (digabung di menu Tuner, tombol "Tuner | Metronome" di header). Gratis.
- [x] **Fase 2 – Mesin hak akses** di `index.html`: `isPremium()`, `showPaywall()`, `applyEntitlements()`, penguncian Latihan/Arcade/Partitur/cloud, mode coba, lagu contoh Mary. **Pembatasan MATI secara bawaan (`GATING_ON=false`)** supaya pengguna yang sudah ada tidak terkunci sebelum pembayaran tersedia. Uji di HP: buka `?gating=1`, lalu Pengaturan > Langganan > ketuk judul 7x > "Mode uji".
- [ ] **Fase 0 – Akun Play (Ferdi):** bayar $25, profil pembayaran, verifikasi identitas, 12 penguji x 14 hari (uji tertutup), buat produk langganan (bulanan + tahunan, penawaran gratis 1 bulan), kunci layanan Google Cloud untuk verifikasi server.
- [ ] **Fase 3 – Play Billing:** TWA dibuat lewat PWABuilder dengan opsi Play Billing; Digital Goods API di aplikasi (harga lokal + beli); Edge Function memverifikasi pembelian ke Google Play Developer API & mengakui (acknowledge, maks 3 hari atau auto-refund); cek status tiap buka aplikasi + cadangan offline beberapa hari; pulihkan pembelian lewat `listPurchases`; uji dengan penguji lisensi. Hasil verifikasi dicatat ke `fertune_purchases` (sumber `playstore`).
- [ ] **Fase 4 – Admin & toko:** tab "Dari Play Store" (sudah ada, kosong) terisi; tab "Dari Web" bisa dihapus. Perbarui deskripsi toko, privasi, Data safety (riwayat pembelian). Tampilkan harga, masa uji coba, dan cara membatalkan di layar berlangganan.
- [ ] **Fase 5 – Rilis:** uji tertutup 14 hari lalu produksi. **Sebelum rilis: set `GATING_ON=true`, ganti `isPremium()` dengan pemeriksaan langganan Play, dan HAPUS "Mode uji" di Pengaturan.**

## Risiko / catatan
- Penguncian di sisi aplikasi bisa dibobol orang yang paham teknis (wajar untuk harga ini; bisa diperkuat dengan cek langganan ke server).
- Langganan butuh internet untuk verifikasi pertama dan berkala.
- Menaikkan harga untuk pelanggan lama butuh persetujuan mereka.
- Aturan Google berubah-ubah: baca ulang kebijakan Payments Google Play sebelum rilis.
