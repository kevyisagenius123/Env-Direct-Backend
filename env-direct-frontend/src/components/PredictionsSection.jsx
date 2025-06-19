import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createApiUrl } from '../utils/apiUtils';

// Placeholder icons - consider react-icons or custom SVGs for more specific visuals
const AlertIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
const ChartBarIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
  </svg>
);

// Helper to get icon component from a string if needed (e.g., if API returns icon names)
const iconMap = {
  alert: AlertIcon,
  chart: ChartBarIcon,
  // Add more icon mappings as needed
};

const PredictionsSection = () => {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Animation variants
  const sectionTitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const fetchPredictions = async () => {
    try {
      const response = await fetch(createApiUrl('/api/predictions'));
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const processedData = data.map(item => ({
        ...item,
        // Ensure iconName from API matches keys in iconMap (e.g., "alert", "chart")
        // Ensure colorTheme from API has at least a 'text' property for the icon
        iconComponent: iconMap[item.iconName?.toLowerCase()] || AlertIcon, 
      }));
      setPredictions(processedData);
    } catch (e) {
      console.error("Failed to fetch predictions:", e);
      setError("Failed to load predictions data.");
      // Fallback to mock data
      setPredictions(mockPredictions);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  let content;

  if (isLoading) {
    content = <p className="text-center text-white py-10">Loading environmental forecasts...</p>;
  } else if (error) {
    content = <p className="text-center text-red-300 py-10">{error}</p>;
  } else if (predictions && predictions.length > 0) {
    content = (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        variants={cardsContainerVariants}
        initial="hidden"
        whileInView={!isLoading && predictions.length > 0 ? "visible" : "hidden"}
        viewport={{ once: true, amount: 0.1 }}
      >
        {predictions.map((item) => {
          const IconToRender = item.iconComponent;
          // Define a default color theme if not provided or incomplete from API
          const defaultColorTheme = { bg: 'bg-gray-100 dark:bg-gray-700/30', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-600' };
          const theme = { ...defaultColorTheme, ...(item.colorTheme || {}) };

          return (
            <motion.div
              key={item.id || item.type}
              className={`rounded-xl shadow-lg overflow-hidden ${theme.bg} border ${theme.border} flex flex-col transition-all duration-300 hover:shadow-2xl`}
              variants={cardItemVariants}
            >
              <div className="p-6 flex-grow">
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`flex-shrink-0 mt-1 p-2 rounded-full ${theme.bg.replace("bg-", "bg-opacity-50 dark:bg-opacity-50").replace("/10", "/30").replace("/20", "/40")} `}>
                     {/* Icon now directly uses the main text color of its theme for more direct association */}
                    <IconToRender className={`w-8 h-8 ${theme.text}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${theme.text}`}>{item.type}</h3>
                    <p className={`text-xs font-medium ${theme.text} opacity-70`}>{item.location} - {item.timeframe}</p>
                  </div>
                </div>
                <p className={`text-xl font-bold ${theme.text} mb-2`}>{item.prediction}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">
                  {item.details}
                </p>
              </div>
              <div className={`p-3 border-t ${theme.border} bg-white/30 dark:bg-black/10 mt-auto`}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Confidence: {item.confidence}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  } else {
    content = <p className="text-center text-white py-10">No environmental predictions available at the moment.</p>;
  }

  return (
    <section className="py-12 md:py-20 bg-mygreen dark:bg-mygreen-dark overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionTitleVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Dominica: Environmental Forecasts & Advisories
          </h2>
          <p className="mt-4 text-lg text-white opacity-90 max-w-2xl mx-auto">
            AI-powered predictions to help you stay informed on the Nature Isle.
          </p>
        </motion.div>
        {content}
        {predictions && predictions.length > 0 && (
          <div className="text-center mt-12">
            <a 
                href="/dominica-forecasts-details"
                className="text-mygreen-light hover:text-white dark:text-mygreen-light dark:hover:text-white font-medium transition-colors"
            >
                View All Forecasts & Advisory Details
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default PredictionsSection; 
