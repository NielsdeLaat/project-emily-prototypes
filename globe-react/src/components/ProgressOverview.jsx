import React from 'react';
import { getProgressByCountry, getProgressByCategory, getProgressByContinent, hasUnlockedReward } from '../utils/progressUtils';

// Continent emoji mapping
const CONTINENT_EMOJIS = {
  'Asia': '🌏',
  'Africa': '🌍',
  'North America': '🌎',
  'South America': '🌎',
  'Europe': '🌍',
  'Oceania': '🌏',
  'Antarctica': '🌎'
};

export default function ProgressOverview({ userProgress, sidebarItems }) {
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
        <h3 className="mt-0 font-semibold">Overall Progress</h3>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emily-blue transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="text-center my-1">
          {visitedStories} / {totalStories} Stories Discovered
        </p>
      </div>

      {/* Continent Progress */}
      <div className="mb-5">
        <h3 className="font-semibold">Continents Explored</h3>
        {Object.entries(continentProgress).map(([continent, progress]) => (
          <div key={continent} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="flex items-center gap-2">
                <span>{CONTINENT_EMOJIS[continent]}</span>
                <span>{continent}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                progress.percentage === 100 
                  ? 'bg-emily-blue text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {progress.percentage === 100 ? '🌟 Explored!' : `${Math.round(progress.percentage)}%`}
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-emily-blue transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 pl-1">
              {progress.visited} / {progress.total} stories • {progress.countries.length} {progress.countries.length === 1 ? 'country' : 'countries'}
            </div>
          </div>
        ))}
      </div>

      {/* Country Progress */}
      <div className="mb-5">
        <h3 className="font-semibold">Countries Explored</h3>
        {Object.entries(countryProgress).map(([country, progress]) => (
          <div key={country} className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span>{country}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                progress.percentage === 100 
                  ? 'bg-emily-blue text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {progress.percentage === 100 ? '🏆 Complete!' : `${Math.round(progress.percentage)}%`}
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emily-blue transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Category Progress */}
      <div>
        <h3 className="font-semibold">Categories Discovered</h3>
        {Object.entries(categoryProgress).map(([category, progress]) => (
          <div key={category} className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span>{category}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                progress.percentage === 100 
                  ? 'bg-emily-blue text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {progress.percentage === 100 ? '🎯 Mastered!' : `${Math.round(progress.percentage)}%`}
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emily-blue transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 