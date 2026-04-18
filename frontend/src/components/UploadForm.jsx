import React from "react";

export default function UploadForm() {
  return (
    <section>
      <h2>Upload CV</h2>
      <form>
        <input type="file" accept=".pdf" />
        <textarea placeholder="Paste job description" rows={6} />
        <button type="submit">Screen CV</button>
      </form>
    </section>
  );
}
