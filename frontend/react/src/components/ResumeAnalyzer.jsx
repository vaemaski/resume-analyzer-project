import React, { useState, useRef, useEffect } from "react";
import {
  Upload, FileText, BarChart3, Brain, CheckCircle, XCircle, Loader2,
} from "lucide-react";

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analysisType, setAnalysisType] = useState("tfidf");
  const [jobRole, setJobRole] = useState("");
  const [jobRoles, setJobRoles] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Fetch job roles only for TF-IDF
  useEffect(() => {
    if (analysisType === "tfidf") {
      fetchJobRoles();
    }
  }, [analysisType]);

  const fetchJobRoles = async () => {
    setLoadingRoles(true);
    try {
      const response = await fetch("http://localhost:8000/job_roles/");
      if (!response.ok) throw new Error("Failed to fetch job roles");
      const data = await response.json();
      setJobRoles(data);
    } catch (err) {
      setError("Unable to load job roles.");
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleFileUpload = (e) => {
    const selected = e.target.files[0];
    if (selected?.type === "application/pdf") {
      setFile(selected);
      setError("");
    } else {
      setError("Only PDF files are allowed.");
    }
  };

  const analyzeResume = async () => {
    if (!file) return setError("Please upload a PDF resume.");
    if (analysisType === "tfidf" && !jobRole)
      return setError("Please select a job role.");
    if (analysisType === "semantic" && !jobDescription.trim())
      return setError("Please enter job description.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("method", analysisType);
    if (analysisType === "tfidf") {
      formData.append("job_role", jobRole);
    } else {
      formData.append("job_description", jobDescription);
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to analyze resume.");
      const data = await res.json();
      setResults(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Resume Analyzer</h1>

      {/* File Upload */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Upload Resume (PDF)</label>
        <div
          className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer hover:border-blue-500"
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          {file ? (
            <p className="text-green-600 font-medium flex justify-center items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {file.name}
            </p>
          ) : (
            <p className="text-gray-500">Click or drag and drop your resume here</p>
          )}
        </div>
      </div>

      {/* Method Selector */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Analysis Method</label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="tfidf"
              checked={analysisType === "tfidf"}
              onChange={(e) => setAnalysisType(e.target.value)}
            />
            <span>TF-IDF</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="semantic"
              checked={analysisType === "semantic"}
              onChange={(e) => setAnalysisType(e.target.value)}
            />
            <span>Semantic</span>
          </label>
        </div>
      </div>

      {/* Job Role Selector (TF-IDF only) */}
      {analysisType === "tfidf" && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Job Role</label>
          {loadingRoles ? (
            <p className="text-gray-500 flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Loading job roles...
            </p>
          ) : (
            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Choose Role --</option>
              {jobRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Job Description (Semantic only) */}
      {analysisType === "semantic" && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Paste Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            className="w-full border rounded px-3 py-2"
            placeholder="Paste the job description here..."
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={analyzeResume}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            Analyze Resume
          </>
        )}
      </button>

      {/* Results */}
      {results && (
        <div className="mt-6 p-4 bg-gray-100 rounded space-y-3">
        <h2 className="text-xl font-semibold mb-2">Results</h2>
        <p><strong>Method:</strong> {results.method}</p>

        {results.method === "tfidf" && results.result && (
            <>
            <p><strong>Score:</strong> {(results.result.score).toFixed(2)}%</p>
            <p><strong>AI Remark:</strong> {results.result.remark}</p>

            {/* Matched Keywords */}
            {results.result.matched?.length > 0 && (
                <div>
                <strong>Matched Keywords:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                {results.result.matched.map((kw, idx) => (
                    <span key={idx} className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">
                    {kw}
                    </span>
                ))}
            </div>
          </div>
        )}

        {/* Missing Keywords */}
        {results.result.missing?.length > 0 && (
          <div>
            <strong>Missing Keywords:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {results.result.missing.map((kw, idx) => (
                <span key={idx} className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </>
    )}

    {results.method === "semantic" && (
      <>
        <p><strong>Score:</strong> {(results.score).toFixed(2)}%</p>
        <p><strong>AI Remark:</strong> {results.remark}</p>
      </>
    )}
  </div>
)}

    </div>
  );
};

export default ResumeAnalyzer;
