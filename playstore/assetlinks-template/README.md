# Isi repo `gitarsaktipol.github.io`

Folder ini adalah **templat**. Isinya harus diletakkan di repo GitHub baru bernama persis
`gitarsaktipol.github.io` (bukan di repo `yuner`), karena Google memeriksa file di alamat:

    https://gitarsaktipol.github.io/.well-known/assetlinks.json

- `.nojekyll` wajib ikut, supaya GitHub Pages tidak menyembunyikan folder `.well-known`.
- Ganti dua baris `GANTI_DENGAN_...` di `assetlinks.json` dengan sidik jari SHA-256
  (lihat langkah 5 di `playstore/PANDUAN-PLAYSTORE.md`).
