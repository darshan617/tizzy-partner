import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const parseUserData = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(value));
  } catch {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const backendUrlValue = process.env.NEXT_PUBLIC_BACKEND_URL;
  const userData = parseUserData(req.cookies?.userData);
  if (!userData?.token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (typeof req.query.url !== "string" || !backendUrlValue) {
    return res.status(400).json({ error: "A valid draft PO URL is required" });
  }

  let backendUrl;
  let poUrl;
  try {
    backendUrl = new URL(backendUrlValue);
    poUrl = new URL(req.query.url);
  } catch {
    console.error("Invalid draft PO or backend URL");
    return res.status(400).json({ error: "Invalid draft PO URL" });
  }

  if (
    backendUrl.protocol !== "https:" ||
    poUrl.protocol !== "https:" ||
    poUrl.origin !== backendUrl.origin ||
    poUrl.username ||
    poUrl.password
  ) {
    return res.status(403).json({ error: "Draft PO URL is not allowed" });
  }

  let pdfResponse;
  try {
    pdfResponse = await fetch(poUrl, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
        Accept: "application/pdf",
      },
      redirect: "manual",
    });
  } catch (error) {
    console.error("Draft PO request failed:", error);
    return res.status(502).json({ error: "Unable to retrieve the draft PO" });
  }

  if (!pdfResponse.ok) {
    console.error("Draft PO server returned status:", pdfResponse.status);
    return res.status(502).json({ error: "Unable to retrieve the draft PO" });
  }

  const contentType = pdfResponse.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/pdf" || !pdfResponse.body) {
    console.error("Draft PO server did not return a PDF:", contentType);
    return res.status(502).json({ error: "The draft PO response is not a PDF" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="draft-po.pdf"');
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  try {
    await pipeline(Readable.fromWeb(pdfResponse.body), res);
  } catch (error) {
    console.error("Failed to stream draft PO:", error);
    if (!res.headersSent) {
      return res.status(502).json({ error: "Unable to display the draft PO" });
    }
    res.destroy(error);
  }
}
