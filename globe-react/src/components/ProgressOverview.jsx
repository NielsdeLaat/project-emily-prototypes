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
    <div style={{
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      {/* Overall Progress */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginTop: 0 }}>Overall Progress</h3>
        <div style={{ 
          height: '8px', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${overallProgress}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <p style={{ textAlign: 'center', margin: '5px 0' }}>
          {visitedStories} / {totalStories} Stories Discovered
        </p>
      </div>

      {/* Continent Progress */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Continents Explored</h3>
        {Object.entries(continentProgress).map(([continent, progress]) => (
          <div key={continent} style={{ marginBottom: '15px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '5px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{CONTINENT_EMOJIS[continent]}</span>
                <span>{continent}</span>
              </span>
              <span style={{ 
                backgroundColor: progress.percentage === 100 ? '#4CAF50' : '#e0e0e0',
                color: progress.percentage === 100 ? 'white' : 'black',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '12px'
              }}>
                {progress.percentage === 100 ? '🌟 Explored!' : `${Math.round(progress.percentage)}%`}
              </span>
            </div>
            <div style={{ 
              height: '6px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '5px'
            }}>
              <div style={{
                width: `${progress.percentage}%`,
                height: '100%',
                backgroundColor: '#9C27B0',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#666',
              paddingLeft: '4px'
            }}>
              {progress.visited} / {progress.total} stories • {progress.countries.length} {progress.countries.length === 1 ? 'country' : 'countries'}
            </div>
          </div>
        ))}
      </div>

      {/* Country Progress */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Countries Explored</h3>
        {Object.entries(countryProgress).map(([country, progress]) => (
          <div key={country} style={{ marginBottom: '10px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '5px'
            }}>
              <span>{country}</span>
              <span style={{ 
                backgroundColor: progress.percentage === 100 ? '#4CAF50' : '#e0e0e0',
                color: progress.percentage === 100 ? 'white' : 'black',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '12px'
              }}>
                {progress.percentage === 100 ? '🏆 Complete!' : `${Math.round(progress.percentage)}%`}
              </span>
            </div>
            <div style={{ 
              height: '6px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress.percentage}%`,
                height: '100%',
                backgroundColor: '#2196F3',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Category Progress */}
      <div>
        <h3>Categories Discovered</h3>
        {Object.entries(categoryProgress).map(([category, progress]) => (
          <div key={category} style={{ marginBottom: '10px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '5px'
            }}>
              <span>{category}</span>
              <span style={{ 
                backgroundColor: progress.percentage === 100 ? '#4CAF50' : '#e0e0e0',
                color: progress.percentage === 100 ? 'white' : 'black',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '12px'
              }}>
                {progress.percentage === 100 ? '🎯 Mastered!' : `${Math.round(progress.percentage)}%`}
              </span>
            </div>
            <div style={{ 
              height: '6px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress.percentage}%`,
                height: '100%',
                backgroundColor: '#FF9800',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 