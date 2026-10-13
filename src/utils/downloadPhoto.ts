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
    // Unsplash image URLs support a dl parameter for attachment downloads.
    // This also works when browser CORS blocks reading the image as a Blob.
    const downloadUrl = new URL(url);
    downloadUrl.searchParams.set("dl", `${filename}.jpg`);
    const link = document.createElement("a");
    link.href = downloadUrl.toString();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
