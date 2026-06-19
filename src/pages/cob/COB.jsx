import { useState, useRef } from "react";
import api from "../../api/axios";
import "./COB.css";

const COB = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Use a ref to keep track of the interval ID across renders
  const intervalRef = useRef(null);

  const handleRun = async () => {
    try {
      setLoading(true);
      setProgress(0);
      setMessage({ type: "info", text: "Starting COB process..." });

      const steps = [
        "Fetching system date...",
        "Updating penalties...",
        "Calculating overdue loans...",
        "Generating reports...",
        "Saving COB history...",
        "Finalizing...",
      ];

      let i = 0;
      intervalRef.current = setInterval(() => {
        if (i < steps.length) {
          setMessage({ type: "info", text: steps[i] });
          setProgress((i + 1) * (100 / steps.length));
          i++;
        }
      }, 600);

      const res = await api.post("/cob/run");

      // Clear interval immediately after API returns
      clearInterval(intervalRef.current);

      setProgress(100);
      setMessage({
        type: "success",
        text: res.data?.message || "COB completed successfully!",
      });

      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      // Clear interval on error so it doesn't loop forever
      clearInterval(intervalRef.current);
      setLoading(false);

      const errorMsg = error.response?.data?.message || "COB failed";

      // FIX: Reset message state on failure so the UI stays in a predictable state
      setMessage({ type: "error", text: errorMsg });

      // Proper string formatting for alert
      alert(`COB failed: ${errorMsg}`);
    }
  };

  return (
    <div className="cob-container">
      <div className="cob-header">
        <div className="header-title-block">
          <h2>Close Of Business (COB)</h2>
          <p>View all information customers</p>
        </div>
      </div>

      {/* Dynamic Success Alert Message Only */}
      {message.type === "success" && (
        <div className="alert-message success">
          <span className="alert-message-icon">✓</span>
          <p>{message.text}</p>
        </div>
      )}

      {/* Progress UI */}
      {loading && (
        <div className="cob-box">
          <p>{message.text}</p>

          <div className="cob-progressBar">
            <div
              className="cob-progressFill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p>{Math.round(progress)}%</p>
        </div>
      )}

      <button className="btn-save" onClick={handleRun} disabled={loading}>
        {loading ? "Processing..." : "Run COB"}
      </button>
    </div>
  );
};

export default COB;
