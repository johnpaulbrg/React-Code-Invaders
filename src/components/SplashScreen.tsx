/**
 * SplashScreen.tsx
 * 
 * Author: John Paul Brogan
 * Date: 2025-10-21
 * Copyright © 2025 John Paul Brogan. All rights reserved.
 *
 * Description:
 * Splash screen for the Code Invaders game. Displays the title, instructions,
 * and language selection buttons. Calls onStart with the chosen language.
 */

import React from 'react';

interface Props {
  onStart: (lang: "C++" | "C#" | "Java" | "Javascript" | "Python") => void;
}

const SplashScreen: React.FC<Props> = ({ onStart }) => {
  // Define available languages and labels
  type Language = "C++" | "C#" | "Java" | "Javascript" | "Python";

  const languages: { key: Language; label: string }[] = [
    { key: "C++", label: "C++" },
    { key: "C#", label: "C#" },
    { key: "Java", label: "Java" },
    { key: "Javascript", label: "JavaScript" },
    { key: "Python", label: "Python" },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // align to top
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        margin: 0,
        paddingTop: '40px',
        backgroundColor: 'black',
        color: 'limegreen',
        textAlign: 'center',
      }}
    >
      <h1>Code Invaders</h1>
      <p>Type falling language keywords to destroy them.</p>
      <p>Select a language to begin:</p>

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
        }}
      >
        {languages.map((lang) => (
          <button
            key={lang.key}
            onClick={() => onStart(lang.key)}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              minWidth: '120px',
            }}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
