// Local storage key
export const PROGRESS_KEY = 'userProgress';

// Continent mapping
export const COUNTRY_TO_CONTINENT = {
  'China': 'Asia',
  'Hong Kong': 'Asia',
  'Mexico': 'North America',
  'Burundi': 'Africa',
  'Uganda': 'Africa',
  'North Korea': 'Asia'
};

// Initialize progress from localStorage
export const initializeProgress = () => {
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (!stored) {
    const initial = { visitedIds: [] };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

// Mark a story as visited
export const markAsVisited = (storyId) => {
  const progress = initializeProgress();
  if (!progress.visitedIds.includes(storyId)) {
    progress.visitedIds.push(storyId);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
  return progress;
};

// Get progress by continent
export const getProgressByContinent = (userProgress, sidebarItems) => {
  const continentProgress = {};
  
  // Initialize continents with their stories
  sidebarItems.forEach(story => {
    const continent = COUNTRY_TO_CONTINENT[story.location.country];
    if (!continentProgress[continent]) {
      continentProgress[continent] = {
        total: 0,
        visited: 0,
        stories: [],
        countries: new Set()
      };
    }
    continentProgress[continent].total += 1;
    continentProgress[continent].stories.push(story);
    continentProgress[continent].countries.add(story.location.country);
  });

  // Count visited stories
  userProgress.visitedIds.forEach(visitedId => {
    const story = sidebarItems.find(s => s.id === visitedId);
    if (story) {
      const continent = COUNTRY_TO_CONTINENT[story.location.country];
      continentProgress[continent].visited += 1;
    }
  });

  // Calculate percentages and convert countries Set to array
  Object.keys(continentProgress).forEach(continent => {
    const progress = continentProgress[continent];
    progress.percentage = (progress.visited / progress.total) * 100;
    progress.countries = Array.from(progress.countries);
  });

  return continentProgress;
};

// Get progress by country
export const getProgressByCountry = (userProgress, sidebarItems) => {
  const countryProgress = {};
  
  // Initialize countries with their stories
  sidebarItems.forEach(story => {
    if (!countryProgress[story.location.country]) {
      countryProgress[story.location.country] = {
        total: 0,
        visited: 0,
        stories: [],
        continent: COUNTRY_TO_CONTINENT[story.location.country]
      };
    }
    countryProgress[story.location.country].total += 1;
    countryProgress[story.location.country].stories.push(story);
  });

  // Count visited stories
  userProgress.visitedIds.forEach(visitedId => {
    const story = sidebarItems.find(s => s.id === visitedId);
    if (story) {
      countryProgress[story.location.country].visited += 1;
    }
  });

  // Calculate percentages
  Object.keys(countryProgress).forEach(country => {
    const progress = countryProgress[country];
    progress.percentage = (progress.visited / progress.total) * 100;
  });

  return countryProgress;
};

// Get progress by category
export const getProgressByCategory = (userProgress, sidebarItems) => {
  const categoryProgress = {};
  
  // Initialize categories
  sidebarItems.forEach(story => {
    story.categories.forEach(category => {
      if (!categoryProgress[category]) {
        categoryProgress[category] = {
          total: 0,
          visited: 0,
          stories: []
        };
      }
      categoryProgress[category].total += 1;
      categoryProgress[category].stories.push(story);
    });
  });

  // Count visited stories
  userProgress.visitedIds.forEach(visitedId => {
    const story = sidebarItems.find(s => s.id === visitedId);
    if (story) {
      story.categories.forEach(category => {
        categoryProgress[category].visited += 1;
      });
    }
  });

  // Calculate percentages
  Object.keys(categoryProgress).forEach(category => {
    const progress = categoryProgress[category];
    progress.percentage = (progress.visited / progress.total) * 100;
  });

  return categoryProgress;
};

// Check if a reward is unlocked
export const hasUnlockedReward = (progress, type, target) => {
  switch (type) {
    case 'country':
      const countryProgress = progress[target];
      return countryProgress && countryProgress.percentage === 100;
    case 'continent':
      const continentProgress = progress[target];
      return continentProgress && continentProgress.percentage === 100;
    case 'category':
      const categoryProgress = progress[target];
      return categoryProgress && categoryProgress.percentage === 100;
    default:
      return false;
  }
}; 