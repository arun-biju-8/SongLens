import { useRef, useState, useEffect } from "react";
import {
  Activity,
  AudioWaveform,
  BrainCircuit,
  ChartNoAxesCombined,
  CheckCircle2,
  Disc3,
  FileAudio,
  Headphones,
  LoaderCircle,
  Music2,
  Pause,
  Play,
  RefreshCw,
  Sparkles,
  Upload,
  X,
  Zap,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import "./App.css";

const API_URL = "http://127.0.0.1:8000/api/analyze";

function formatGenre(genre = "") {
  return genre.charAt(0).toUpperCase() + genre.slice(1);
}

function formatNumber(value, digits = 2) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : "—";
}

function App() {
  const inputRef = useRef(null);
  const audioRef = useRef(null);

  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  function selectFile(selectedFile) {
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop().toLowerCase();

    if (!["mp3", "wav"].includes(extension)) {
      setError("Please select an MP3 or WAV audio file.");
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError("File size must be 25 MB or less.");
      return;
    }

    if (audioUrl) URL.revokeObjectURL(audioUrl);

    setFile(selectedFile);
    setAudioUrl(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
    setIsPlaying(false);
  }

  function handleFileInput(event) {
    selectFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  }

  async function analyzeSong() {
    if (!file) {
      setError("Please upload an audio file first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Audio analysis failed.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to SongLens. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function togglePlayback() {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setError("Unable to play this audio file.");
      }
    }
  }

  function resetAnalysis() {
    setResult(null);
    setError("");
  }

  const analysis = result?.analysis;
  const features = analysis?.features;

  const genreData = analysis
    ? Object.entries(analysis.genre_probabilities)
        .map(([genre, score]) => ({
          genre: formatGenre(genre),
          score: Number(score),
        }))
        .sort((a, b) => b.score - a.score)
    : [];

  const topGenres = genreData.slice(0, 5);

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <AudioWaveform size={23} />
          </div>
          <div>
            <h1>SongLens<span>.</span></h1>
            <p>AI MUSIC INTELLIGENCE</p>
          </div>
        </div>

        <div className="header-right">
          <div className="system-status">
            <span className="status-dot" />
            SYSTEM READY
          </div>
          <div className="avatar">
            <Headphones size={18} />
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={14} />
              YOUR PERSONAL MUSIC LAB
            </div>

            <h2>
              Hear beyond the
              <span> sound.</span>
            </h2>

            <p>
              Discover the hidden characteristics of your music.
              Upload a track and let machine learning and AI
              uncover its musical identity.
            </p>
          </div>

          <div className="hero-art">
            <div className="disc disc-outer">
              <div className="disc-inner">
                <div className="disc-label">
                  <AudioWaveform size={35} />
                </div>
              </div>
            </div>
            <div className="floating-note note-one">♪</div>
            <div className="floating-note note-two">♫</div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
          </div>
        </section>

        <section className="workspace">
          <div className="section-heading">
            <div>
              <span className="section-kicker">01 / INPUT</span>
              <h3>Upload your track</h3>
            </div>
            <span className="file-support">
              <FileAudio size={15} />
              MP3 / WAV · MAX 25 MB
            </span>
          </div>

          <div
            className={`upload-panel ${isDragging ? "drag-active" : ""} ${
              file ? "has-file" : ""
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".mp3,.wav,audio/mpeg,audio/wav"
              onChange={handleFileInput}
              hidden
            />

            {!file ? (
              <div className="upload-empty">
                <div className="upload-icon">
                  <Upload size={27} />
                </div>
                <h4>Drop your audio into the studio</h4>
                <p>or browse files from your device</p>
                <button
                  className="browse-button"
                  onClick={() => inputRef.current?.click()}
                >
                  <Music2 size={16} />
                  Choose audio file
                </button>
              </div>
            ) : (
              <div className="selected-file">
                <div className="file-art">
                  <Disc3 size={28} />
                </div>

                <div className="file-details">
                  <h4 title={file.name}>{file.name}</h4>
                  <p>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB ·{" "}
                    {file.name.split(".").pop().toUpperCase()} AUDIO
                  </p>
                </div>

                <button
                  className="remove-file"
                  title="Remove file"
                  onClick={() => {
                    if (audioUrl) URL.revokeObjectURL(audioUrl);
                    setFile(null);
                    setAudioUrl("");
                    setResult(null);
                    setError("");
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {file && (
            <div className="player-panel">
              <button
                className="play-button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
              >
                {isPlaying ? <Pause size={19} /> : <Play size={19} />}
              </button>
              <div className="player-info">
                <div className="player-title">AUDIO PREVIEW</div>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
            </div>
          )}

          <div className="analyze-row">
            <div className="pipeline-hint">
              <BrainCircuit size={16} />
              <span>ML CLASSIFIER</span>
              <span className="pipeline-arrow">→</span>
              <Sparkles size={16} />
              <span>GEMINI AI</span>
            </div>

            <button
              className="analyze-button"
              onClick={analyzeSong}
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="spin" size={18} />
                  Analyzing track...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze my music
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <X size={17} />
              {error}
            </div>
          )}
        </section>

        {loading && (
          <section className="loading-panel">
            <div className="loading-visual">
              <AudioWaveform size={34} />
            </div>
            <h3>Listening to your track...</h3>
            <p>
              Extracting audio features, identifying its genre and
              generating your AI music insights.
            </p>
            <div className="loading-bar">
              <span />
            </div>
            <div className="loading-steps">
              <span><CheckCircle2 size={14} /> Audio uploaded</span>
              <span><Activity size={14} /> ML analysis</span>
              <span><Sparkles size={14} /> AI interpretation</span>
            </div>
          </section>
        )}

        {result && analysis && (
          <section className="results-section">
            <div className="section-heading results-heading">
              <div>
                <span className="section-kicker">02 / DISCOVERY</span>
                <h3>Your music breakdown</h3>
              </div>
              <button className="reset-button" onClick={resetAnalysis}>
                <RefreshCw size={15} />
                Clear results
              </button>
            </div>

            <div className="results-grid">
              <div className="result-card genre-card">
                <div className="card-topline">
                  <span>DETECTED GENRE</span>
                  <div className="card-icon purple">
                    <Music2 size={17} />
                  </div>
                </div>

                <div className="genre-main">
                  <div>
                    <h2>{formatGenre(analysis.predicted_genre)}</h2>
                    <p>Top predicted genre</p>
                  </div>
                  <div className="genre-score">
                    {formatNumber(
                      analysis.genre_probabilities[analysis.predicted_genre]
                    )}%
                  </div>
                </div>

                <div className="score-track">
                  <span
                    style={{
                      width: `${
                        analysis.genre_probabilities[
                          analysis.predicted_genre
                        ]
                      }%`,
                    }}
                  />
                </div>
                <p className="card-footnote">
                  Model score, not a calibrated confidence percentage.
                </p>
              </div>

              <div className="result-card tempo-card">
                <div className="card-topline">
                  <span>TRACK TEMPO</span>
                  <div className="card-icon cyan">
                    <Activity size={17} />
                  </div>
                </div>
                <div className="metric-number">
                  {formatNumber(features.tempo, 1)}
                  <span>BPM</span>
                </div>
                <p className="metric-description">
                  Beats per minute
                </p>
                <div className="mini-wave">
                  {Array.from({ length: 26 }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        height: `${18 + ((i * 17 + 13) % 39)}px`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="result-card energy-card">
                <div className="card-topline">
                  <span>RMS ENERGY</span>
                  <div className="card-icon orange">
                    <Zap size={17} />
                  </div>
                </div>
                <div className="metric-number">
                  {formatNumber(features.rms_mean, 3)}
                </div>
                <p className="metric-description">
                  Average signal energy
                </p>
                <div className="energy-track">
                  <span
                    style={{
                      width: `${Math.min(
                        100,
                        Number(features.rms_mean) * 250
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="analysis-columns">
              <div className="result-card chart-card">
                <div className="card-heading">
                  <div>
                    <span className="section-kicker">ML MODEL OUTPUT</span>
                    <h4>Genre distribution</h4>
                  </div>
                  <ChartNoAxesCombined size={19} />
                </div>

                <ResponsiveContainer width="100%" height={290}>
                  <BarChart
                    data={topGenres}
                    layout="vertical"
                    margin={{ top: 8, right: 24, left: 12, bottom: 8 }}
                  >
                    <CartesianGrid
                      stroke="#29263a"
                      horizontal={false}
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fill: "#8f8ba3", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="genre"
                      width={78}
                      tick={{ fill: "#d4d0e1", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "#242137" }}
                      contentStyle={{
                        background: "#191725",
                        border: "1px solid #39324f",
                        borderRadius: "10px",
                        color: "#fff",
                      }}
                      formatter={(value) => [
                        `${Number(value).toFixed(2)}%`,
                        "Model score",
                      ]}
                    />
                    <Bar
                      dataKey="score"
                      fill="#a78bfa"
                      radius={[0, 7, 7, 0]}
                      barSize={19}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <p className="chart-note">
                  Showing the five highest model scores.
                </p>
              </div>

              <div className="result-card features-card">
                <div className="card-heading">
                  <div>
                    <span className="section-kicker">AUDIO ANALYSIS</span>
                    <h4>Sound characteristics</h4>
                  </div>
                  <AudioWaveform size={19} />
                </div>

                <div className="feature-row">
                  <div>
                    <span>RMS Energy</span>
                    <p>Overall signal energy</p>
                  </div>
                  <strong>{formatNumber(features.rms_mean, 4)}</strong>
                </div>

                <div className="feature-row">
                  <div>
                    <span>Spectral Centroid</span>
                    <p>Sound brightness indicator</p>
                  </div>
                  <strong>
                    {formatNumber(features.spectral_centroid_mean, 1)} Hz
                  </strong>
                </div>

                <div className="feature-row">
                  <div>
                    <span>Spectral Rolloff</span>
                    <p>Frequency distribution</p>
                  </div>
                  <strong>
                    {formatNumber(features.rolloff_mean, 1)} Hz
                  </strong>
                </div>

                <div className="feature-row">
                  <div>
                    <span>Zero Crossing Rate</span>
                    <p>Signal sign-change rate</p>
                  </div>
                  <strong>
                    {formatNumber(features.zero_crossing_rate_mean, 4)}
                  </strong>
                </div>

                <div className="feature-row">
                  <div>
                    <span>Chroma Mean</span>
                    <p>Pitch-class distribution</p>
                  </div>
                  <strong>{formatNumber(features.chroma_stft_mean, 4)}</strong>
                </div>
              </div>
            </div>

            <div className="result-card ai-card">
              <div className="ai-card-header">
                <div className="ai-icon">
                  <Sparkles size={21} />
                </div>
                <div>
                  <span className="section-kicker">POWERED BY GEMINI</span>
                  <h4>AI Music Insights</h4>
                </div>
                <span className="ai-live">GENERATED</span>
              </div>

              <div className="ai-content">
                {result.ai_analysis ? (
                  <div className="ai-text">
                    {result.ai_analysis
                      .replace(/\r\n/g, "\n")
                      .split("\n")
                      .map((line, index) => {
                        const trimmed = line.trim();

                        if (!trimmed) return <div key={index} className="ai-spacer" />;

                        if (trimmed.startsWith("###")) {
                          return (
                            <h5 key={index}>
                              {trimmed.replace(/^#+\s*/, "")}
                            </h5>
                          );
                        }

                        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                          return (
                            <h5 key={index}>
                              {trimmed.replace(/\*\*/g, "")}
                            </h5>
                          );
                        }

                        return (
                          <p key={index}>
                            {trimmed.replace(/\*\*/g, "").replace(/\*/g, "")}
                          </p>
                        );
                      })}
                  </div>
                ) : (
                  <p className="no-ai-text">
                    No AI analysis was returned by the server.
                  </p>
                )}
              </div>
            </div>

            <div className="result-disclaimer">
              <Activity size={15} />
              SongLens provides experimental music analysis. Genre predictions
              may be incorrect, and numerical audio features cannot fully
              describe musical mood or instrumentation.
            </div>
          </section>
        )}

        {!result && !loading && (
          <section className="empty-state">
            <div className="empty-icon">
              <Disc3 size={22} />
            </div>
            <div>
              <h4>Your analysis will appear here</h4>
              <p>Upload a track and start discovering its sound.</p>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <AudioWaveform size={17} />
          SONGLENS
        </div>
        <span>Machine Learning × Generative AI</span>
        <span>Built for music discovery.</span>
      </footer>
    </div>
  );
}

export default App;