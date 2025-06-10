const video = document.getElementById("introVideo");
let isRecording = false;
const recordBtn = document.getElementById("recordBtn");

document.getElementById("recordBtn").addEventListener("click", async () => {
  if (isRecording) return;
  isRecording = true;
  recordBtn.classList.add("recording");

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  let audioChunks = [];

  console.log("🎙️ Opname gestart...");
  mediaRecorder.start();

  mediaRecorder.addEventListener("dataavailable", (event) => {
    audioChunks.push(event.data);
  });

  mediaRecorder.addEventListener("stop", async () => {
    console.log("🛑 Opname gestopt.");
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

    const transcript = await transcribeWithWhisper(audioBlob);
    console.log("📝 Transcript:", transcript);

    const gptAnswer = await fetchEmilyResponse(transcript);
    console.log("🤖 Emily zegt:", gptAnswer);

    await fetchTTS(gptAnswer);

    recordBtn.classList.remove("recording");
    isRecording = false;
  });

  setTimeout(() => mediaRecorder.stop(), 5000);
});

// 🎧 Whisper via backend
async function transcribeWithWhisper(blob) {
  const formData = new FormData();
  formData.append("audio", blob, "audio.webm");

  const response = await fetch("http://localhost:3001/api/whisper", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  console.log("🔍 Server-response:", data);

  if (data.error) {
    console.error("❌ Whisper-fout:", data.error.message);
    return "Transcriptie mislukt.";
  }
  return data.text;
}

// 🧠 GPT via backend
async function fetchEmilyResponse(prompt) {
  const response = await fetch("http://localhost:3001/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();
  if (data.error) {
    console.error("❌ GPT-fout:", data.error.message);
    return "Er ging iets mis.";
  }

  return data.choices[0].message.content.trim();
}

// 🔊 TTS via backend
async function fetchTTS(text) {
  const response = await fetch("http://localhost:3001/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    console.error("❌ ElevenLabs-fout:", await response.text());
    return;
  }

  console.log("✅ Audio binnen");

  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
  const audioUrl = URL.createObjectURL(blob);

  const player = document.getElementById("audioPlayer");
  player.src = audioUrl;

  try {
    await player.play();
    video.style.visibility = "visible";
    video.style.display = "block";
    video.play();
    console.log("🔊 Emily spreekt.");
  } catch (err) {
    console.error("🔇 Audio kon niet worden afgespeeld:", err);
  }

  player.addEventListener("ended", () => {
    video.pause();
    video.currentTime = 0;
    video.style.display = "none";
    console.log("🎥 Video gestopt na stem.");
  });
}
