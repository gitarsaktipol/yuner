# Templat assetlinks.json (verifikasi domain TWA)

File ini hanya **templat**. File aslinya harus tersaji di:

    https://gitarsakti.com/.well-known/assetlinks.json

yaitu di folder `public/.well-known/assetlinks.json` pada repo website **`gitarsaktipol/gitarsaktipol`** (Vercel).
Jangan dibuat di repo ini maupun di repo `gitarsaktipol.github.io`.

- Package: `com.gitarsakti.fertune`.
- Ganti dua baris `GANTI_DENGAN_...` dengan sidik jari SHA-256 (lihat langkah 5 di `playstore/PANDUAN-PLAYSTORE.md`).
- Berkas `.nojekyll` di folder ini tidak dipakai lagi (sisa rencana GitHub Pages) dan boleh diabaikan.
