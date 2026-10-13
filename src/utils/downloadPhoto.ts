/**
 * Save an Unsplash image via a browser Blob so cross-origin URLs do not
 * silently ignore the HTML download attribute.
 */
export async function downloadPhoto(url: string, description = "photo"): Promise<void> {
  const filename = (description || "photo")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 55) || "photo";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Image download failed");
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `${filename}.${blob.type.includes("png") ? "png" : "jpg"}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 3000);
  } catch {
    // Direct image opening is a graceful fallback if the image CDN blocks CORS.
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
