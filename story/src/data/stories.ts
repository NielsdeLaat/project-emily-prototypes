export interface StorySegment {
  id: number;
  title: string;
  videoUrl: string;
  subtitles: Array<{
    startTime: number;
    endTime: number;
    text: string;
  }>;
}

export interface Story {
  id: number;
  title: string;
  segments: StorySegment[];
}

export const stories: Story[] = [
  //HONG KONG
  {
    id: 1,
    title: "Demonstraties in Hongkong",
    segments: [
      {
        id: 1,
        title: "Geschiedenis van Hong Kong",
        videoUrl: "/videos/hongkong-city.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 3,
            text: "Hongkong hoort bij China, maar had jarenlang een eigen bestuur en wetten.",
          },
          {
            startTime: 3,
            endTime: 6,
            text: "Tot 1997 was het een Britse kolonie met westerse vrijheden.",
          },
          {
            startTime: 6,
            endTime: 11,
            text: "China beloofde: vijftig jaar lang blijven persvrijheid en rechtspraak beschermd.",
          },
        ],
      },
      {
        id: 2,
        title: "Protesteren voor vrijheid",
        videoUrl: "/videos/hongkong-demonstrations.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 6,
            text: "In 2019 wilde China verdachten uit Hongkong kunnen uitleveren aan het vasteland.",
          },
          {
            startTime: 6,
            endTime: 12,
            text: "Veel mensen vreesden oneerlijke processen en verlies van hun vrijheid en rechten.",
          },
          {
            startTime: 12,
            endTime: 17,
            text: "Miljoenen jongeren, ouders en ouderen protesteerden wekenlang in de straten van Hongkong.",
          },
        ],
      },
      {
        id: 3,
        title: "Reactie van China",
        videoUrl: "/videos/hongkong-police.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 5,
            text: "De protesten werden met geweld neergeslagen en tientallen leiders werden opgepakt.",
          },
          {
            startTime: 5,
            endTime: 10,
            text: "In 2020 kwam een nieuwe wet die protest, kritiek en meningen strafbaar maakte.",
          },
          {
            startTime: 10,
            endTime: 14,
            text: "Kranten sloten, partijen verdwenen, en duizenden activisten vluchtten naar het buitenland.",
          },
        ],
      },
    ],
  },
  //OEGANDA
  {
    id: 2,
    title: "LHBTI-rechten in Oeganda",
    segments: [
      {
        id: 1,
        title: "Wet en cultuur",
        videoUrl: "/videos/uganda-flag.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 3,
            text: "Oeganda ligt in Oost-Afrika en telt meer dan 45 miljoen inwoners.",
          },
          {
            startTime: 4,
            endTime: 7,
            text: "Het land staat bekend om zijn natuur, jonge bevolking en religieuze tradities.",
          },
          {
            startTime: 7,
            endTime: 11,
            text: "Christendom en islam spelen een grote rol in het dagelijks leven en de politiek.",
          },
          {
            startTime: 11,
            endTime: 15,
            text: "Binnen deze conservatieve samenleving is er weinig ruimte voor seksuele diversiteit.",
          },
        ],
      },
      {
        id: 2,
        title: "Straf en stigma",
        videoUrl: "/videos/uganda-arrest.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 5,
            text: "LHBTI-personen riskeren in Oeganda gevangenisstraf, ontslag en uitsluiting.",
          },
          {
            startTime: 5,
            endTime: 10,
            text: "In 2023 werd een wet aangenomen die zelfs het 'promoten' van homoseksualiteit verbiedt.",
          },
          {
            startTime: 10,
            endTime: 15,
            text: "Kerken, media en politici wakkeren angst en haat aan tegen seksuele minderheden.",
          },
        ],
      },
      {
        id: 3,
        title: "Verzet en hoop",
        videoUrl: "/videos/uganda-lgbtq-support.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 4,
            text: "Ondanks het gevaar blijven activisten opkomen voor mensenrechten en zorgtoegang.",
          },
          {
            startTime: 4,
            endTime: 8,
            text: "Ze bieden juridische hulp, gezondheidszorg en training aan journalisten en beleidsmakers.",
          },
          {
            startTime: 8,
            endTime: 12,
            text: "Hun strijd toont: zelfs onder druk is moed, solidariteit en verandering mogelijk.",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Vluchtelingen uit Noord-Korea",
    segments: [
      {
        id: 1,
        title: "Leven in armoede en honger",
        videoUrl: "/videos/nkorea-intro.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 4,
            text: "Noord-Korea kende in de jaren '90 een zware hongersnood die honderdduizenden levens kostte.",
          },
          {
            startTime: 4,
            endTime: 8,
            text: "In arme mijnstreken stierven hele families van de honger, zonder hulp van de staat.",
          },
          {
            startTime: 8,
            endTime: 12,
            text: "Ouders verkochten bezittingen of ruilden zelfs van hun kinderen om voedsel te bemachtigen.",
          },
          {
            startTime: 12,
            endTime: 15,
            text: "Voor veel gezinnen was vluchten de enige manier om te overleven.",
          },
        ],
      },
      {
        id: 2,
        title: "De oversteek naar China",
        videoUrl: "/videos/nkorea-river.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 5,
            text: "Via bevroren rivieren, zoals de Tumen rivier, proberen veel Noord-Koreanen naar China te vluchten.",
          },
          {
            startTime: 5,
            endTime: 10,
            text: "De oversteek is gevaarlijk: mensen zakken door het ijs of worden neergeschoten door grenswachten. Niet veel Koreanen overleven de vlucht.",
          },
        ],
      },
      {
        id: 3,
        title: "Terugkeer en vervolging",
        videoUrl: "/videos/nkorea-labor.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 4,
            text: "China deporteert veel Noord-Koreanen die worden opgepakt, terug naar het regime.",
          },
          {
            startTime: 4,
            endTime: 8,
            text: "Teruggestuurde vluchtelingen belanden vaak in werkkampen of gevangenissen.",
          },
          {
            startTime: 8,
            endTime: 12,
            text: "Kinderen en ouderen worden soms vrijgelaten, maar leven dan zonder registratie of steun.",
          },
        ],
      },
      {
        id: 4,
        title: "Een leven in vrijheid",
        videoUrl: "/videos/nkorea-skorea.mp4",
        subtitles: [
          {
            startTime: 0,
            endTime: 5,
            text: "Sommigen weten via tussenpersonen en risicovolle routes Zuid-Korea of Europa te bereiken.",
          },
          {
            startTime: 5,
            endTime: 10,
            text: "Daar bouwen ze een nieuw leven op, met veiligheid, onderwijs en toekomst.",
          },
          {
            startTime: 10,
            endTime: 15,
            text: "Veel gevluchte Noord-Koreanen delen hun verhaal, om aandacht te vragen voor wie is achtergebleven.",
          },
        ],
      },
    ],
  },
];
