import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spinner from './Spinner';
import { createApiUrl } from '../utils/apiUtils';

// Placeholder icons - consider using a library like react-icons or custom SVGs
const MetricIcon = ({ IconComponent, colorClass }) => (
  <div className={`p-3 rounded-full ${colorClass || 'bg-mygreen/20 text-mygreen'} mr-4`}>
    <IconComponent className="w-6 h-6" />
  </div>
);

// Example Icon Components (simple SVGs for placeholders)
const AirIcon = (props) => (
  <svg {...props} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M5 12c0-1.933 1.567-3.5 3.5-3.5S12 10.067 12 12s-1.567 3.5-3.5 3.5S5 13.933 5 12zm0 0H3m2 0h2m11-5a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);
const WaterIcon = (props) => (
  <svg {...props} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-4a6 6 0 100-12 6 6 0 000 12z"></path>
    <path d="M12 12a3 3 0 100-6 3 3 0 000 6z"></path>
  </svg>
);
const TempIcon = (props) => (
  <svg {...props} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M8 13.5a4 4 0 100-8 4 4 0 000 8zm0 0V21M8 3.5V2M12 4.5h7M12 9.5h7M12 14.5h7"></path>
  </svg>
);

// Default/initial structure for metrics, including mapping icon components
const initialMetricDefinitions = {
  aqi: { 
    name: "Air Quality Index (AQI)", 
    icon: AirIcon, 
    defaultDetails: "Roseau Capital Average", 
    getStyle: (value) => {
      const aqiVal = parseInt(value);
      if (aqiVal <= 50) return { iconBg: "bg-green-100 dark:bg-green-700/30", iconText: "text-green-600 dark:text-green-300", valueText: "text-green-700 dark:text-green-300" };
      if (aqiVal <= 100) return { iconBg: "bg-yellow-100 dark:bg-yellow-700/30", iconText: "text-yellow-600 dark:text-yellow-400", valueText: "text-yellow-700 dark:text-yellow-400" };
      if (aqiVal <= 150) return { iconBg: "bg-orange-100 dark:bg-orange-700/30", iconText: "text-orange-600 dark:text-orange-400", valueText: "text-orange-700 dark:text-orange-400" };
      return { iconBg: "bg-red-100 dark:bg-red-700/30", iconText: "text-red-600 dark:text-red-400", valueText: "text-red-700 dark:text-red-400" };
    }
  },
  waterQuality: { 
    name: "River Water Quality", 
    icon: WaterIcon, 
    defaultDetails: "Layou River Monitoring Point",
    getStyle: (value) => { // Assuming value is a percentage for purity
        const purity = parseInt(value);
        if (purity >= 90) return { iconBg: "bg-blue-100 dark:bg-blue-700/30", iconText: "text-blue-600 dark:text-blue-300", valueText: "text-blue-700 dark:text-blue-300" };
        if (purity >= 70) return { iconBg: "bg-sky-100 dark:bg-sky-700/30", iconText: "text-sky-600 dark:text-sky-400", valueText: "text-sky-700 dark:text-sky-400" };
        return { iconBg: "bg-orange-100 dark:bg-orange-700/30", iconText: "text-orange-600 dark:text-orange-400", valueText: "text-orange-700 dark:text-orange-400" };
    }
  },
  temperature: { 
    name: "Ambient Temperature", 
    icon: TempIcon, 
    defaultDetails: "Canefield Airport Vicinity",
    getStyle: (value) => { // Example: color by temperature range
        const temp = parseFloat(value);
        if (temp >= 28) return { iconBg: "bg-red-100 dark:bg-red-700/30", iconText: "text-red-500 dark:text-red-400", valueText: "text-red-600 dark:text-red-400" };
        if (temp <= 22) return { iconBg: "bg-blue-100 dark:bg-blue-700/30", iconText: "text-blue-500 dark:text-blue-300", valueText: "text-blue-600 dark:text-blue-300" };
        return { iconBg: "bg-yellow-100 dark:bg-yellow-700/30", iconText: "text-yellow-600 dark:text-yellow-400", valueText: "text-yellow-700 dark:text-yellow-400" };
    }
  },
};

// Fallback mock data for when API calls fail
const mockMetricsData = {
  aqi: {
    value: "45",
    unit: "AQI",
    details: "Roseau Capital Average (Mock Data)"
  },
  waterQuality: {
    value: "85",
    unit: "%",
    details: "Layou River Monitoring Point (Mock Data)"
  },
  temperature: {
    value: "26.5",
    unit: "°C",
    details: "Canefield Airport Vicinity (Mock Data)"
  }
};

const LiveDataDashboardSection = () => {
  const [metricsData, setMetricsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation variants
  const sectionTitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardsContainerVariants = {
    hidden: { opacity: 0 }, // Parent container, just fades in
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }, // Stagger children after a small delay
    },
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const fetchDashboardData = async () => {
    setError(null);
    try {
      const response = await fetch(createApiUrl('/api/live-data'));
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMetricsData(data);
    } catch (e) {
      console.error("Failed to fetch dashboard data:", e);
      setError("Failed to load live environmental data. Please try again later.");
    }
    if (isLoading) setIsLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  let content;

  if (isLoading && !metricsData) {
    content = <Spinner />
  } else if (error && !metricsData) {
    content = <p className="text-center text-red-300 py-10">{error}</p>;
  } else if (metricsData) {
    const displayableMetrics = Object.keys(initialMetricDefinitions).map(key => {
      const definition = initialMetricDefinitions[key];
      const liveData = metricsData[key];
      if (!liveData || liveData.value === undefined || liveData.unit === undefined) return null;

      const style = definition.getStyle ? definition.getStyle(liveData.value) : { iconBg: 'bg-gray-100', iconText: 'text-gray-600', valueText: 'text-gray-700' };

      return {
        id: key,
        name: definition.name,
        value: liveData.value,
        unit: liveData.unit,
        iconBg: style.iconBg,
        iconText: style.iconText,
        valueText: style.valueText,
        icon: definition.icon,
        details: liveData.details || definition.defaultDetails,
      };
    }).filter(Boolean);

    content = (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        variants={cardsContainerVariants}
        initial="hidden"
        animate={!isLoading && metricsData ? "visible" : "hidden"}
      >
        {displayableMetrics.length > 0 ? displayableMetrics.map((metric) => (
          <motion.div
            key={metric.id}
            className={`bg-white dark:bg-env-gray-dark rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:shadow-2xl`}
            variants={cardItemVariants}
          >
            <div className="flex items-center mb-4">
              <MetricIcon IconComponent={metric.icon} colorClass={`${metric.iconBg} ${metric.iconText}`} />
              <div>
                <h3 className={`text-base font-semibold text-gray-700 dark:text-gray-200`}>
                  {metric.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{metric.details}</p>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className={`text-4xl font-bold ${metric.valueText}`}>{metric.value}</p>
              <p className={`text-sm ${metric.valueText} opacity-80`}>{metric.unit}</p>
            </div>
          </motion.div>
        )) : <p className="text-center text-white col-span-full py-10">No live data available at the moment.</p>}
      </motion.div>
    );
  } else {
    content = <p className="text-center text-white py-10">No live data available at the moment, or failed to load.</p>;
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
            Live Environmental Dashboard
          </h2>
          <p className="mt-4 text-lg text-white opacity-90 max-w-2xl mx-auto">
            Stay updated with the latest environmental metrics from across Dominica.
          </p>
        </motion.div>
        {content}
        <div className="text-center mt-12">
            <p className="text-sm text-white opacity-80">
                {isLoading && metricsData ? "Updating live data..." : (error ? "Problem updating data." : "Data is fetched from live sensors and APIs for Dominica.")}
            </p>
        </div>
      </div>
    </section>
  );
};

export default LiveDataDashboardSection; 
