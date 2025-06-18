import React from "react";

export default function FeedContent() {
  return (
    <div>
      <h2>Feed Content</h2>
      <p>This is where the feed content will go.</p>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <p style={{ color: "#666", margin: 0 }}>
          Content for the new feed sidebar.
        </p>
        <p style={{ color: "#666", margin: 0 }}>
          You can add posts, updates, or other dynamic content here.
        </p>
      </div>
    </div>
  );
}
