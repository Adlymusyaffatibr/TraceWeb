This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## struktur
Tabel Identitas & Akses
Tabel ini buat simpan data user dan handle Google Session.

Nama Tabel    Kolom    Tipe Data    Keterangan
tb_users    id    UUID / BigInt (PK)    ID Unik user.
google_id    Varchar (Unique)    ID dari Google Auth untuk session.
name    Varchar    Nama lengkap user.
email    Varchar (Unique)    Email untuk verifikasi OTP.
role    Enum    'admin' atau 'user'.
created_at    Timestamp    Waktu pendaftaran.
Tabel Master Kategori (Kelolaan Admin)
Kenapa dipisah? Supaya Admin bisa tambah/hapus kategori tanpa ganggu kode.

Nama Tabel    Kolom    Tipe Data    Keterangan
tb_categories    id    Int (PK)    Contoh: Lifestyle, Konsumsi.
category_name    Varchar    Nama kategori utama.
tb_sub_categories    id    Int (PK)    Contoh: Outfit, Makanan, Bensin.
category_id    Int (FK)    Relasi ke tb_categories.
sub_name    Varchar    Nama sub-kategorinya.
Tabel Transaksi (Pemisahan Logika)
Sesuai request lu: Pengeluaran pakai kategori, Pemasukan pakai deskripsi.

Tabel Pengeluaran (tb_pengeluaran)

id: UUID (PK)

user_id: UUID (FK ke tb_users) -> On Delete Cascade.

category_id: Int (FK)

sub_category_id: Int (FK)

nominal: Decimal / BigInt.

date_masuk: Date / Timestamp.

Tabel Pemasukan (tb_pemasukan)

id: UUID (PK)

user_id: UUID (FK ke tb_users)

nominal: Decimal / BigInt.

description: Text / Varchar.

date_masuk: Date / Timestamp.

Tabel Limitasi (Mesin Alert)
Tabel ini yang bakal Express.js cek setiap kali lu input pengeluaran.

Nama Tabel    Kolom    Tipe Data    Keterangan
tb_limits    id    UUID (PK)
user_id    UUID (FK)    Limit tiap orang beda-beda.
category_id    Int (FK)    Limit per kategori utama.
limit_nominal    Decimal    Batas maksimal uang.
month    Int    Misal: 3 (Maret).
year    Int    Misal: 2026.