"use client";

import { useState } from "react";

export default function UploadsPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setStatus(`${file.name} uploaded successfully.`);
    } else {
      const error = await response.text();
      setStatus(`Upload failed: ${error}`);
    }

    setUploading(false);
    event.target.value = "";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">File Uploads</h1>
        <p className="mt-1 text-muted">
          Upload documents, PDFs, and Excel files for later AI analysis and graphing.
        </p>
      </div>

      <div className="rounded-3xl border border-hairline bg-surface-2 p-8">
        <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-hairline bg-surface text-center text-ink transition-colors duration-200 ease-out hover:border-accent/50 hover:bg-surface-3">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            className="sr-only"
            onChange={handleUpload}
            disabled={uploading}
          />
          <div className="space-y-3">
            <p className="text-lg font-semibold text-ink">Select a file to upload</p>
            <p className="text-sm text-muted">
              Supported formats: PDF, Word, Excel, CSV, text.
            </p>
            <p className="text-sm text-muted">Your file is stored securely for AI review later.</p>
          </div>
        </label>
      </div>

      {status ? (
        <div className="rounded-xl border border-hairline bg-surface-2 p-4 text-sm text-ink">
          {status}
        </div>
      ) : null}
    </div>
  );
}
