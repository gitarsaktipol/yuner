# Catatan masukan penguji & perubahan (untuk pengajuan Produksi)

Setelah uji tertutup selesai (minimal 12 penguji, 14 hari), Play Console meminta **Ajukan akses produksi**
dan menanyakan beberapa hal, antara lain:

- *Ringkasan masukan dari penguji dan cara mengumpulkannya*
- *Perubahan apa yang dibuat berdasarkan hasil uji tertutup*
- *Bagaimana memutuskan aplikasi siap produksi*

Setiap masukan penguji + perubahan yang dibuat **dicatat di sini** (terbaru di bawah), supaya saat mengisi
formulir itu tinggal disalin. Jawaban di formulir boleh bahasa Inggris; draf bahasa Inggris ada di tiap entri.

Cara masukan dikumpulkan: email masukan uji tertutup **fertune.support@gmail.com** dan pesan langsung
dari penguji ke Ferdi.

---

## 1. Halaman Pengaturan terlalu panjang (10 Nov 2026)

**Masukan penguji:** halaman Pengaturan menampilkan semua bagian (Langganan, Akun, Izin, Tema, Bantuan)
berderet ke bawah sehingga terasa berat dan melelahkan untuk di-scroll. Saran: jadikan menu bertingkat;
pisahkan Langganan jadi tombol/halaman sendiri; Akun & Bantuan dibuat ringkas.

**Perubahan (PR #192, tayang 10 Nov 2026, `fertune-v200`):**
- Halaman awal Pengaturan sekarang hanya daftar menu (Akun, Izin alat musik, Tampilan, Bantuan,
  Kebijakan Privasi, Syarat & Ketentuan), masing-masing dengan keterangan singkat (email, status izin, tema).
- Tiap menu membuka halamannya sendiri dengan tombol "◀ Pengaturan"; tombol Kembali Android kembali ke daftar.
- Langganan dipindah ke halaman sendiri, dibuka lewat spanduk "Langganan: Gratis — Upgrade ke Premium".
- Akun: form masuk langsung tampil bila belum masuk; "Hapus akun" dilipat.
- Bantuan: topik berbentuk baris dengan panah, satu topik terbuka sekaligus.

**Draf jawaban (Inggris):**
> A tester reported that the Settings screen was too long: subscription info, account, permissions, theme and
> help were all stacked on one scrolling page, which felt heavy. We redesigned Settings into a nested menu:
> the main screen is now a short list (Account, Instrument permissions, Appearance, Help, Privacy Policy,
> Terms) with a one-line status under each item, and each item opens its own page with a back button
> (Android back also returns to the list). The subscription details moved to a dedicated page opened from a
> compact "Plan: Free — Upgrade" banner, the sign-in form only appears on the Account page, account deletion
> is collapsed, and Help topics are shown as expandable rows with only one open at a time.
