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

---

## 2. Pemeriksaan menyeluruh sebelum produksi (10 Nov 2026)

**Sumber:** audit internal (kestabilan, keamanan, tampilan) selama uji tertutup.

**Perubahan (PR #194 `fertune-v201` dan PR berikutnya `fertune-v202`):**
- Data partitur yang rusak tidak lagi membuat aplikasi macet; isian teks disaring.
- Pembaruan aplikasi tidak lagi memuat ulang halaman di tengah permainan.
- Aplikasi ditinggal ke latar: permainan dijeda dan mikrofon dimatikan otomatis.
- HP dipakai bergantian: partitur satu akun tidak ikut terunggah ke akun lain.
- Editor Partitur di HP: menu bawah disembunyikan supaya tuts piano tidak tertutup.
- Latihan: tombol "Seperti terakhir" (langsung ke soal), teks lebih kontras, layar kecil 320×568 dirapikan.

**Draf jawaban (Inggris):**
> During closed testing we also ran an internal stability, security and usability review. We hardened loading of
> saved data so a corrupted item can no longer prevent the app from starting, sanitized user-entered text, and made
> app updates wait until the user is not in the middle of a game. The app now pauses the game and releases the
> microphone when it goes to the background. On shared phones, one account's cloud-saved scores are no longer
> uploaded to another account. On phones, the score editor hides the bottom navigation so the on-screen piano is
> fully visible, the practice flow got a "same as last time" shortcut, text contrast was improved, and the tuner
> layout was fixed for very small screens (320×568).


---

## 3. Animasi "tahan" terpotong di not penuh akhir lagu (11 Nov 2026)

**Masukan penguji:** di Arcade, animasi tekan-lama (tahan tuts) pada not penuh terpotong keluar layar — hanya terjadi
bila not penuh itu berada di bagian akhir (ending).

**Perubahan (`fertune-v206`):** bilah animasi tahan untuk not terakhir di sebuah baris sekarang berhenti di garis birama
sesudahnya (tidak lagi memanjang melewati tepi partitur); bila ruangnya sempit, bilah dimulai sedikit lebih ke kiri dan
angka hitungan yang terlalu rapat diringkas.

**Draf jawaban (Inggris):**
> A tester reported that the "hold the key" animation on a whole note was cut off at the edge of the screen when that
> note was the last one of the piece. The hold-progress bar is now limited to the final bar line of the line it is on,
> so it always stays fully visible; in tight spaces it starts slightly further left and the beat counters are simplified.
