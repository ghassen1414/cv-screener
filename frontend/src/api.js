export async function screenCv({ file, jobDescription }) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);

  const response = await fetch("/api/screen", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to screen CV");
  }

  return response.json();
}
