# r2-uploader

A minimal Cloudflare Worker upload page for uploading files into Cloudflare R2.

## Setup

1. Install Wrangler:
   ```bash
   npm install -g wrangler
   ```
2. Create an R2 bucket in Cloudflare.
3. Update `wrangler.toml` with your real bucket name:
   ```toml
   [[r2_buckets]]
   binding = "R2_BUCKET"
   bucket_name = "your-r2-bucket-name"
   ```
4. Authenticate and run locally:
   ```bash
   wrangler login
   wrangler dev
   ```
5. Open the Worker URL shown by Wrangler, choose a file, and upload.

## Deploy

```bash
wrangler deploy
```
