import React from 'react';
import { getProgressByCountry, getProgressByCategory, getProgressByContinent, hasUnlockedReward } from '../utils/progressUtils';

// Continent emoji mapping and Dutch translations
const CONTINENT_EMOJIS = {
  'Azië': '🌏',
  'Afrika': '🌍',
  'Noord-Amerika': '🌎',
  'Zuid-Amerika': '🌎',
  'Europa': '🌍',
  'Oceanië': '🌏',
  'Antarctica': '🌎'
};

// Translation mapping for continents (English to Dutch)
const CONTINENT_TRANSLATIONS = {
  'Asia': 'Azië',
  'Africa': 'Afrika',
  'North America': 'Noord-Amerika',
  'South America': 'Zuid-Amerika',
  'Europe': 'Europa',
  'Oceania': 'Oceanië',
  'Antarctica': 'Antarctica'
};

// Translation mapping for categories
const CATEGORY_TRANSLATIONS = {
  'religious': 'Religieuze Vervolging',
  'lgbtq': 'LHBTI+ Rechten',
  'racism': 'Racisme',
  'political': 'Politieke Onderdrukking',
  'gender': 'Genderrechten',
  'refugee': 'Vluchteling'
};

export default function ProgressOverview({ userProgress, sidebarItems, onResetProgress }) {
  const countryProgress = getProgressByCountry(userProgress, sidebarItems);
  const categoryProgress = getProgressByCategory(userProgress, sidebarItems);
  const continentProgress = getProgressByContinent(userProgress, sidebarItems);

  const totalStories = sidebarItems.length;
  const visitedStories = userProgress.visitedIds.length;
  const overallProgress = (visitedStories / totalStories) * 100;

  return (
    <div className="p-5 bg-white rounded-xl shadow-md">
      {/* Overall Progress */}
      <div className="mb-5">
        <h3 className="mt-0 font-semibold">Voltooide voortgang</h3>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={overallProgress === 100 ? "progress-bar bg-emily-blue" : "progress-bar bg-orange-500"}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-center my-1">
          {visitedStories} / {totalStories} Verhalen ontdekt
        </p>
      </div>

      {/* Continent Progress */}
      <div className="mb-5">
        <h3 className="font-semibold">Continenten ontdekt</h3>
        {Object.entries(continentProgress).map(([continent, progress]) => (
          <div key={continent} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="flex items-center gap-2">
                <span>{CONTINENT_EMOJIS[CONTINENT_TRANSLATIONS[continent]]}</span>
                <span>{CONTINENT_TRANSLATIONS[continent]}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                progress.percentage === 100 
                  ? 'bg-emily-blue text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {progress.percentage === 100 ? '🌟 Ontdekt!' : `${Math.round(progress.percentage)}%`}
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
              <div
                className={progress.percentage === 100 ? "progress-bar bg-emily-blue" : "progress-bar bg-orange-500"}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 pl-1">
              {progress.visited} / {progress.total} verhalen • {progress.countries.length} {progress.countries.length === 1 ? 'land' : 'landen'}
            </div>
          </div>
        ))}
      </div>

      {/* Country Progress */}
      <div className="mb-5">
        <h3 className="font-semibold">Landen ontdekt</h3>
        {Object.entries(countryProgress).map(([country, progress]) => (
          <div key={country} className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span>{country}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                progress.percentage === 100 
                  ? 'bg-emily-blue text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {progress.percentage === 100 ? '🏆 Voltooid!' : `${Math.round(progress.percentage)}%`}
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={progress.percentage === 100 ? "progress-bar bg-emily-blue" : "progress-bar bg-orange-500"}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Category Progress */}
      <div className="mb-6">
        <h3 className="font-semibold">Categorieën ontdekt</h3>
        {Object.entries(categoryProgress).map(([category, progress]) => (
          <div key={category} className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span>{CATEGORY_TRANSLATIONS[category]}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                progress.percentage === 100 
                  ? 'bg-emily-blue text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {progress.percentage === 100 ? '🎯 Voltooid!' : `${Math.round(progress.percentage)}%`}
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={progress.percentage === 100 ? "progress-bar bg-emily-blue" : "progress-bar bg-orange-500"}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Reset Progress Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onResetProgress}
          className="w-full px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors duration-300"
        >
          Vooruitgang resetten
        </button>
      </div>
    </div>
  );
} 