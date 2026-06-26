/**
 * Reusable helper utility to upload design files to the Cloudinary API endpoint.
 *
 * @param file The HTML File object chosen by the user
 * @returns The secure CDN URL returned by Cloudinary
 */
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "فشل رفع الملف إلى الخادم.");
  }

  return data.url;
}
