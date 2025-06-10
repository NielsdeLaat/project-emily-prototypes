require('dotenv').config();

const FormData = require('form-data');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch');

const app = express();
const upload = multer();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = "SXBL9NbvTrjsJQYay2kT"; // werkende voice ID

// 🎧 Whisper (audio naar tekst)
app.post('/api/whisper', upload.single('audio'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: "audio.webm",
      contentType: "audio/webm"
    });
    formData.append("model", "whisper-1");
    formData.append("language", "nl");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Whisper backend-fout:", err);
    res.status(500).json({ error: "Transcription failed" });
  }
});

// 🧠 GPT (tekstuele reactie)
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

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
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  res.json(data);
});

// 🔊 ElevenLabs (tekst naar audio)
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;

    const trimmed = text.slice(0, 600); // veilige limiet

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: trimmed,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.9,
          similarity_boost: 0.8,
          speed: 0.6 
        }
      }),
    });

    const audio = await response.arrayBuffer();
    console.log("📦 Audio buffer size:", audio.byteLength);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline; filename="emily.mp3"'
    });
    res.send(Buffer.from(audio));
  } catch (err) {
    console.error("TTS backend-fout:", err);
    res.status(500).json({ error: "TTS failed" });
  }
});

app.listen(3001, () => {
  console.log("✅ Secure API server running on http://localhost:3001");
});
