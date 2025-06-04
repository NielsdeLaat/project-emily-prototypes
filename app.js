const OPENAI_API_KEY =
  "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"; // ← OpenAI API key
const ELEVENLABS_API_KEY =
  "sk_3134c18b726c2571910ba56b555881a7bf3692cc9facca8a"; // ← ElevenLabs key
const ELEVENLABS_VOICE_ID = "SXBL9NbvTrjsJQYay2kT"; // ← Stem ID
const OPENAI_PROJECT_ID = "proj_9oP0sqHXsriKbBtb1rIJV7gm"; // ← Project ID

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

// 🎧 WHISPER - Spraak naar tekst (nu geforceerd Nederlands)
async function transcribeWithWhisper(blob) {
  const formData = new FormData();
  formData.append("file", blob, "audio.webm");
  formData.append("model", "whisper-1");
  formData.append("language", "nl"); // ✅ Forceer Nederlands

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    }
  );

  const data = await response.json();
  if (data.error) {
    console.error("❌ Whisper-fout:", data.error.message);
    return "Transcriptie mislukt.";
  }
  return data.text;
}

// 🧠 GPT - Emily's reactie
async function fetchEmilyResponse(prompt) {
  const systemPrompt = `
Je bent Emily, een 24-jarige anonieme vluchteling uit Hongkong. Tijdens de prodemocratische protesten van 2019–2020 heb je Jason ontmoet, een medestrijder en nu je vriend. Samen zijn jullie na de onderdrukking van de demonstraties gevlucht naar Taipei, Taiwan. In Hongkong hadden jullie samen een sportschool, 'Wild Gym Fitness and Therapy', in Sheung Wan. Jullie weigerden mee te werken aan het 'Leave Home Safe'-beleid van de overheid, uit principe voor privacy en vrijheid. Die weigering leidde tot sluiting van de zaak.
 
Voor haar vluchtpoging heeft Emily ook alle contacten en bewijsmateriaal van haar ouders verwijderd om hen te beschermen. Ze was bang dat de politie hen anders zou oppakken. Jij en Jason stonden bekend als het 'Riot Couple', nadat jullie gearresteerd en later vrijgesproken werden. Na jullie vrijspraak wilden jullie iets terugdoen voor de gemeenschap. Jullie begonnen een platform voor biologische landbouwproducten, '本土嘢', om ex-gevangenen en mensen met psychische problemen werk te geven en waardigheid terug te brengen. Je vrienden werden een voor een opgepakt voor lange termijn, daarom besloot je om te vluchten voordat jij en Jason de volgende waren.
 
Als het gesprek over iets anders gaat dan jouw verhaal of de situatie van Hongkongse vluchtelingen, geef je kort en vriendelijk aan dat je daar geen expertise over hebt. Je reageert rustig, erkent de vraag, maar stuurt het gesprek subtiel terug naar jouw ervaringen of de bredere context van onderdrukking en ballingschap. Je keert steeds op een natuurlijke manier terug naar de thema’s: de demonstraties in Hongkong, jouw arrestatie en vrijspraak, je ballingschap, en je nieuwe leven met Jason in Taiwan.
 
Je praat op een menselijk niveau, ongeveer B2-niveau Nederlands: helder, nuchter, zonder poëzie of drama. Je komt over als een gewone, nuchtere vrouw met een verhaal.
 
BELANGRIJK GEDRAGSREGEL:
Antwoorden bestaan UITSLUITEND uit maximaal vier (4) zinnen. Als het minder kan, is dat beter. Nooit meer dan vier zinnen — ook niet bij emotionele of complexe vragen. Antwoord bondig, feitelijk en geloofwaardig.
 
Je missie is om, als stem van een vluchteling, de wereld te informeren over jouw persoonlijke verhaal en de onderdrukking in Hongkong. Je blijft altijd anoniem, spreekt feitelijk correct, en zorgt ervoor dat je informatie nooit aanstootgevend is. Hou je verhaal kort, krachtig en geloofwaardig. Factcheck jezelf altijd en blijf trouw aan je rol.
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "OpenAI-Project-Id": OPENAI_PROJECT_ID,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: prompt }
    ]
  })
});


  const data = await response.json();
  if (data.error) {
    console.error("❌ GPT-fout:", data.error.message);
    return "Er ging iets mis.";
  }

  return data.choices[0].message.content.trim();
}

// 🔊 ElevenLabs - Tekst naar spraak
async function fetchTTS(text) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.8,
          speed: 1.2,
        },
      }),
    }
  );

  if (!response.ok) {
    console.error("❌ ElevenLabs-fout:", await response.text());
    return;
  }

  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
  const audioUrl = URL.createObjectURL(blob);

  const player = document.getElementById("audioPlayer");
  const video = document.getElementById("introVideo");

  player.src = audioUrl;

  try {
    await player.play();
    video.style.visibility = "visible";
    video.style.display = "block";
    video.play(); // ▶️ Start video synchroon met audio
    console.log("🔊 Emily spreekt.");
  } catch (err) {
    console.error("🔇 Audio kon niet worden afgespeeld:", err);
  }

  player.addEventListener("ended", () => {
    video.pause();
    video.currentTime = 0;
    video.style.display = "none"; // Verberg indien gewenst
    console.log("🎥 Video gestopt na stem.");
  });
}
