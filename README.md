# r2-uploader

A Bun + TypeScript Cloudflare Worker upload page for uploading files into Cloudflare R2.

## Setup

1. Install Bun: https://bun.sh/
2. Install dependencies:
   ```bash
   bun install
   ```
3. Create an R2 bucket in Cloudflare.
4. Update `wrangler.toml` with your real bucket name:
   ```toml
   [[r2_buckets]]
   binding = "R2_BUCKET"
   bucket_name = "your-r2-bucket-name"
   ```
5. Authenticate and run locally:
   ```bash
   bunx wrangler login
   bun run dev
   ```
6. Open the Worker URL shown by Wrangler, choose a file, and upload.

## Type check

```bash
bun run check
```

## Deploy

```bash
bun run deploy
```
