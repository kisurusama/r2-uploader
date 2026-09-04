const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>R2 Uploader</title>
    <style>
      body { font-family: system-ui, sans-serif; max-width: 560px; margin: 2rem auto; padding: 0 1rem; }
      form { display: grid; gap: 0.75rem; }
      input, button { font: inherit; padding: 0.55rem; }
      #status { white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <h1>Upload file to R2</h1>
    <form id="upload-form">
      <label>
        Object key (optional)
        <input type="text" name="key" placeholder="folder/my-file.txt" />
      </label>
      <label>
        File
        <input type="file" name="file" required />
      </label>
      <button type="submit">Upload</button>
    </form>
    <p id="status"></p>

    <script>
      const form = document.getElementById('upload-form');
      const statusEl = document.getElementById('status');

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        statusEl.textContent = 'Uploading...';

        const body = new FormData(form);

        try {
          const response = await fetch('/upload', { method: 'POST', body });
          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Upload failed');
          }

          statusEl.textContent = 'Uploaded successfully\\nKey: ' + result.key + '\\nSize: ' + result.size + ' bytes';
          form.reset();
        } catch (error) {
          statusEl.textContent = error.message;
        }
      });
    </script>
  </body>
</html>`;

const sanitizeFileName = (name: string): string =>
  name
    .replace(/^\.+/, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 200);

interface Env {
  R2_BUCKET: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/') {
      return new Response(html, {
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'x-content-type-options': 'nosniff',
        },
      });
    }

    if (request.method === 'POST' && url.pathname === '/upload') {
      try {
        const formData = await request.formData();
        const file = formData.get('file');
        const keyInput = formData.get('key');

        if (!(file instanceof File)) {
          return Response.json({ error: 'File is required' }, { status: 400 });
        }

        const requestedKey = typeof keyInput === 'string' ? keyInput.trim() : '';
        const safeFileName = sanitizeFileName(file.name || 'upload.bin') || 'upload.bin';
        const key = requestedKey || `${Date.now()}-${safeFileName}`;

        await env.R2_BUCKET.put(key, file.stream(), {
          httpMetadata: {
            contentType: file.type || 'application/octet-stream',
          },
        });

        return Response.json({ key, size: file.size });
      } catch (error) {
        return Response.json(
          { error: error instanceof Error ? error.message : 'Unexpected upload error' },
          { status: 500 },
        );
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
