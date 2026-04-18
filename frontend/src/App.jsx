import React from "react";
import UploadForm from "./components/UploadForm";
import ResultCard from "./components/ResultCard";

export default function App() {
  return (
    <main>
      <h1>AI CV Screener</h1>
      <UploadForm />
      <ResultCard />
    </main>
  );
}
