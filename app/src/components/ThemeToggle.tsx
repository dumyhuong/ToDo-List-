"use client";
import React from 'react';
import { useTheme } from '@/app/src/utils/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`
                p-3 rounded-full shadow-lg
                 transition-all duration-300
                hover:scale-110 active:scale-95
                ${theme === 'light'
                    ? 'bg-yellow-400 text-gray-800 hover:bg-yellow-500'
                    : 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                }
  `}
        >

            {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
        </button>
    );
};

export default ThemeToggle;