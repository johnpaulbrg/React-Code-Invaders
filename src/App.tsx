/**
 * App.tsx
 * 
 * Author: John Paul Brogan
 * Date: 2025-10-21
 * Copyright © 2025 John Paul Brogan. All rights reserved.
 *
 * Description:
 * Entry point for the Code Invaders game. Renders either the splash screen
 * or the game component depending on the selected language.
 */

import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import Game from './components/Game';
import javaWords from './languages/java17.json';
import csharpWords from './languages/csharp10.json';
import cppWords from './languages/cpp23.json';
import jsWords from './languages/javascriptES2023.json';
import pythonWords from './languages/python3.14.json';

const App: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<
    "C++" | "C#" | "Java" | "Javascript" | "Python" | null
  >(null);

  const wordSets = {
    "C++": cppWords,
    "C#": csharpWords,
    "Java": javaWords,
    "Javascript": jsWords,
    "Python": pythonWords,
  };

  if (!selectedLang) {
    return <SplashScreen onStart={setSelectedLang} />;
  }

  return <Game words={wordSets[selectedLang]} language={selectedLang} />;
};

export default App;
