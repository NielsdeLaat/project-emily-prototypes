import React, { useState, useEffect } from "react";

// Import images (assuming these will be passed or handled within StoriesContent if dynamic)
import ablikimImg from "../img/Ablikim.png";
import emilyImg from "../img/Emily.png";
import carlosImg from "../img/Carlos.png";
import barryImg from "../img/Barry.png";
import tyroneImg from "../img/Tyrone.png";
import eunjuImg from "../img/Eunju_Kim.png";
import kikonyogoImg from "../img/Kikonyogo_Kivumbi.png";

// Categories for filtering - Moved here
const categories = {
  religious: { label: "Religious Persecution", icon: "⛪" },
  lgbtq: { label: "LGBTQ+ Rights", icon: "🏳️‍🌈" },
  racism: { label: "Racial Discrimination", icon: "✊" },
  political: { label: "Political Oppression", icon: "🗳️" },
  gender: { label: "Gender Rights", icon: "♀️" },
  refugee: { label: "Refugee Status", icon: "🏃" },
};

// Story data - Moved here
const sidebarItems = [
  {
    id: 1,
    title: "Ablikim",
    description:
      "Zijn geloof werd verboden, zijn arbeid gestolen, zijn identiteit uitgewist , toch wist hij te ontsnappen.",
    image: ablikimImg,
    location: {
      name: "Xinjiang Village",
      coordinates: [87.6177, 43.7928],
      country: "China",
    },
    categories: ["religious", "political"],
  },
  {
    id: 2,
    title: "Emily",
    description:
      "Gewapend met een stem en een masker trotseerde ze traangas en stilte — en vond vrijheid in het vertellen.",
    image: emilyImg,
    location: {
      name: "Hong Kong",
      coordinates: [114.1694, 22.3193],
      country: "Hong Kong",
    },
    categories: ["political", "gender"],
  },
  {
    id: 3,
    title: "Carlos",
    description:
      "Hij groeide op tussen grenzen, van landen, culturen en verwachtingen, en vocht zich vrij met zijn blik op waardigheid.",
    image: carlosImg,
    location: {
      name: "Mexico City",
      coordinates: [-99.1332, 19.4326],
      country: "Mexico",
    },
    categories: ["refugee", "racism"],
  },
  {
    id: 4,
    title: "Barry",
    description:
      "Verlaten, verkracht en verguisd, maar nog altijd vechtend voor zichzelf, zijn gezin en zijn waarheid.",
    image: barryImg,
    location: {
      name: "Bujumbura",
      coordinates: [29.3618, -3.3731],
      country: "Burundi",
    },
    categories: ["lgbtq", "political"],
  },
  {
    id: 5,
    title: "Tyrone",
    description:
      "Gejaagd om zijn bestaan, door staten en straten, bleef hij vechten voor een plek waar hij gewoon mocht zijn.",
    image: tyroneImg,
    location: {
      name: "Kampala",
      coordinates: [32.5825, 0.3476],
      country: "Uganda",
    },
    categories: ["lgbtq", "refugee"],
  },
  {
    id: 6,
    title: "Eunju Kim",
    description:
      "Ze trotseerde dood, vrieskou en verraad , voor een maaltijd, een stem, en uiteindelijk een leven in vrijheid.",
    image: eunjuImg,
    location: {
      name: "Eundok",
      coordinates: [129.3274, 41.8142],
      country: "North Korea",
    },
    categories: ["political", "gender"],
  },
  {
    id: 7,
    title: "Kikonyogo Kivumbi",
    description:
      "Geverfd als vijand vanwege liefde, verloor hij zijn werk, zijn veiligheid en bijna zijn leven , maar niet zijn stem.",
    image: kikonyogoImg,
    location: {
      name: "Kampala",
      coordinates: [32.5825, 0.3476],
      country: "Uganda",
    },
    categories: ["lgbtq", "political"],
  },
];

export default function StoriesContent() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredStories, setFilteredStories] = useState(sidebarItems);
  const [selectedLocation, setSelectedLocation] = useState(null); // Assuming selectedLocation is managed externally or needs to be here

  // Filter stories based on selected country and categories
  const filterStories = (country, categories) => {
    return sidebarItems.filter((item) => {
      const matchesCountry = !country || item.location.country === country;
      const matchesCategories =
        categories.length === 0 ||
        categories.every((cat) => item.categories.includes(cat));
      return matchesCountry && matchesCategories;
    });
  };

  // Handle category selection
  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      setFilteredStories(filterStories(selectedLocation, newCategories));
      return newCategories;
    });
  };

  useEffect(() => {
    // This effect runs when filteredStories or selectedCategories changes
    // It's here for completeness, as map-related updates are in GlobeView
  }, [filteredStories, selectedCategories]);

  return (
    <>
      {/* Filter Section */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          transition: "all 0.3s ease",
        }}
      >
        <div
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: isFilterOpen ? "15px" : "0",
          }}
        >
          <h3 style={{ margin: 0, color: "#333" }}>Filters</h3>
          <span style={{ fontSize: "20px" }}>{isFilterOpen ? "▼" : "▶"}</span>
        </div>

        {isFilterOpen && (
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              transition: "max-height 0.3s ease",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#666" }}>
                Categories
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {Object.entries(categories).map(([key, { label, icon }]) => (
                  <button
                    key={key}
                    onClick={() => toggleCategory(key)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: selectedCategories.includes(key)
                        ? "#3386c0"
                        : "#e0e0e0",
                      color: selectedCategories.includes(key)
                        ? "white"
                        : "#333",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stories List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          maxWidth: "90%",
          margin: "0 auto",
        }}
      >
        {filteredStories.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              padding: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              aspectRatio: "1",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{ flex: "1", position: "relative", marginBottom: "12px" }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
            <h3
              style={{
                margin: "0 0 6px 0",
                color: "#333",
                fontSize: "16px",
                lineHeight: "1.2",
                padding: "0 4px",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                margin: "0 0 8px 0",
                color: "#666",
                fontSize: "13px",
                lineHeight: "1.3",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                padding: "0 4px",
              }}
            >
              {item.description}
            </p>
            <div
              style={{
                display: "flex",
                gap: "5px",
                padding: "0 4px",
              }}
            >
              {item.categories.map((cat) => (
                <span
                  key={cat}
                  style={{
                    background: "#e0e0e0",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  {categories[cat].icon} {categories[cat].label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
