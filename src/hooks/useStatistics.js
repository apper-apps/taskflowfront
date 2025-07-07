import { useState, useEffect } from 'react';
import { statisticService } from '@/services/api/statisticService';

export const useStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statisticService.getAll();
      setStatistics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStatistic = async (statisticData) => {
    try {
      const newStatistic = await statisticService.create(statisticData);
      setStatistics(prev => [...prev, newStatistic]);
      return newStatistic;
    } catch (err) {
      throw new Error('Failed to add statistic');
    }
  };

  const updateStatistic = async (id, statisticData) => {
    try {
      const updatedStatistic = await statisticService.update(id, statisticData);
      setStatistics(prev => prev.map(stat => 
        stat.Id === id ? updatedStatistic : stat
      ));
      return updatedStatistic;
    } catch (err) {
      throw new Error('Failed to update statistic');
    }
  };

  const deleteStatistic = async (id) => {
    try {
      await statisticService.delete(id);
      setStatistics(prev => prev.filter(stat => stat.Id !== id));
    } catch (err) {
      throw new Error('Failed to delete statistic');
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  return {
    statistics,
    loading,
    error,
    addStatistic,
    updateStatistic,
    deleteStatistic,
    loadStatistics
  };
};