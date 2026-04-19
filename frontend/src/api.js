const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function screenCV({ cvFile, jobDescription }) {
  const formData = new FormData();
  formData.append("cv_file", cvFile);
  formData.append("job_description", jobDescription);

  let response;
  try {
    response = await fetch(`${API_BASE}/screen`, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    throw new Error(
      "Could not reach the screening server. Is the backend running on http://localhost:8000?"
    );
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data?.detail) message = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
      else if (data?.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response.json();
}
