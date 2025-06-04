# Emily – Virtuele Stem van Verzet

**Emily** is een AI-gestuurde virtuele vluchteling, gebaseerd op een echt persoon die is gevlucht in HK naat Taiwan na de politieke protesten in 2019-2020.
In dit prototype kun je met Emily praten via je microfoon. Ze luistert naar wat je zegt, transcribeert je stem via Whisper, genereert een inhoudelijk antwoord via GPT-3.5 en spreekt dat terug via ElevenLabs. De video op de achtergrond speelt synchroon mee tijdens haar antwoord. Wegens kosten is er maar 1 video die we afspelen, dus het loopt niet gelijk met der lippen, maar is zeker wel mogelijk

Dit project is gebouwd als schoolopdracht voor HBO-ICT – Media & Design (semester 6), en combineert frontend development, API-integraties en storytelling via technologie.

---

## 🎥 Wat doet dit project?

- 🎙️ **Live spraakopname** via je browser (MediaRecorder API)
- 🧠 **Transcriptie** met OpenAI Whisper (NL)
- 🤖 **Reacties** via GPT-3.5, gebaseerd op Emily’s fictieve achtergrondverhaal
- 🔊 **Tekst-naar-spraak** met ElevenLabs
- 🎞️ **Video playback** synchroon met stem
- 🔐 **API keys** veilig opgeslagen via `.env` in de backend

---
## ⚙️ Installatie & gebruik

1. **Clone het project of download de map**
2. **Installeer backend dependencies**

```bash
cd virtual-human/server
npm install
```
Pas het .env  bestand aan in virtual-human/server/

start de back-end
```bash
node server.js
```
 ## Gebruikte technologieën
Node.js + Express
OpenAI Whisper (spraak naar tekst)
GPT-3.5 Turbo (tekstgeneratie)
ElevenLabs (tekst naar spraak)
MediaRecorder API (audio opname)
HTML5 Audio & Video
