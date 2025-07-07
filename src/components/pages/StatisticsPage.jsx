import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { format, parseISO, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { useStatistics } from '@/hooks/useStatistics';
import { useTasks } from '@/hooks/useTasks';
import { categoryService } from '@/services/api/categoryService';

const StatisticsPage = () => {
  const { statistics, loading: statsLoading, error: statsError, addStatistic } = useStatistics();
  const { tasks } = useTasks();
  const [timeRange, setTimeRange] = useState('week');
  const [chartData, setChartData] = useState({});
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    calculateMetrics();
    prepareChartData();
  }, [tasks, statistics, timeRange]);

  useEffect(() => {
    // Create Hobbies category if it doesn't exist
    const createHobbiesCategory = async () => {
      try {
        await categoryService.create({
          name: 'Hobbies',
          color: '#9333EA',
          taskCount: 0,
          createdAt: new Date().toISOString()
        });
      } catch (error) {
        // Category might already exist, ignore error
        console.log('Hobbies category may already exist');
      }
    };

    createHobbiesCategory();
  }, []);

  const calculateMetrics = () => {
    const now = new Date();
    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);
    
    // Calculate completion rate
    const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
    
    // Calculate productivity score (0-100)
    const productivityScore = Math.min(100, Math.round(
      (completedTasks.length * 10) + (completionRate * 0.5)
    ));

    // Get recent data based on time range
    const daysToCheck = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const cutoffDate = subDays(now, daysToCheck);
    
    const recentTasks = tasks.filter(task => 
      new Date(task.createdAt) > cutoffDate
    );
    
    const recentCompleted = recentTasks.filter(task => task.completed);

    setMetrics({
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      completionRate: Math.round(completionRate),
      productivityScore,
      recentTasks: recentTasks.length,
      recentCompleted: recentCompleted.length,
      averageDailyTasks: Math.round(recentTasks.length / daysToCheck)
    });
  };

  const prepareChartData = () => {
    const now = new Date();
    const daysToShow = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    let dateRange;
    if (timeRange === 'week') {
      const start = startOfWeek(now);
      const end = endOfWeek(now);
      dateRange = eachDayOfInterval({ start, end });
    } else {
      dateRange = Array.from({ length: daysToShow }, (_, i) => subDays(now, daysToShow - 1 - i));
    }

    const dailyData = dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayTasks = tasks.filter(task => {
        const taskDate = format(new Date(task.createdAt), 'yyyy-MM-dd');
        return taskDate === dateStr;
      });
      
      const completed = dayTasks.filter(task => task.completed).length;
      
      return {
        date: dateStr,
        label: format(date, timeRange === 'week' ? 'EEE' : 'MMM d'),
        total: dayTasks.length,
        completed,
        pending: dayTasks.length - completed
      };
    });

    // Task completion chart
    const taskCompletionChart = {
      series: [
        {
          name: 'Completed',
          data: dailyData.map(d => d.completed)
        },
        {
          name: 'Pending',
          data: dailyData.map(d => d.pending)
        }
      ],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: { show: false }
        },
        colors: ['#22C55E', '#F59E0B'],
        xaxis: {
          categories: dailyData.map(d => d.label)
        },
        legend: {
          position: 'top'
        },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 4
          }
        }
      }
    };

    // Productivity trend chart
    const productivityChart = {
      series: [{
        name: 'Productivity Score',
        data: dailyData.map(d => {
          const score = d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0;
          return score;
        })
      }],
      options: {
        chart: {
          type: 'line',
          height: 350,
          toolbar: { show: false }
        },
        colors: ['#5B46F0'],
        stroke: {
          curve: 'smooth',
          width: 3
        },
        xaxis: {
          categories: dailyData.map(d => d.label)
        },
        yaxis: {
          min: 0,
          max: 100
        },
        markers: {
          size: 6
        }
      }
    };

    setChartData({
      taskCompletion: taskCompletionChart,
      productivity: productivityChart
    });
  };

  const generateTodayStats = async () => {
    try {
      const today = new Date();
      const todayTasks = tasks.filter(task => {
        const taskDate = format(new Date(task.createdAt), 'yyyy-MM-dd');
        const todayDate = format(today, 'yyyy-MM-dd');
        return taskDate === todayDate;
      });

      const completed = todayTasks.filter(task => task.completed).length;
      const productivityScore = todayTasks.length > 0 ? 
        Math.round((completed / todayTasks.length) * 100) : 0;

      await addStatistic({
        name: `Daily Stats - ${format(today, 'MMM d, yyyy')}`,
        productivityScore,
        tasksCompleted: completed,
        timeSpent: Math.round(completed * 30), // Estimate 30 minutes per completed task
        date: format(today, 'yyyy-MM-dd')
      });
    } catch (error) {
      console.error('Failed to generate stats:', error);
    }
  };

  if (statsLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Loading type="statistics" />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Error 
          title="Failed to load statistics"
          message={statsError}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Productivity Statistics
          </h1>
          <p className="text-gray-600 mt-1">
            Track your productivity and task completion trends
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-32"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </Select>
          
          <Button
            variant="accent"
            onClick={generateTodayStats}
            className="shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="BarChart3" className="w-4 h-4 mr-2" />
            Generate Stats
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{metrics.completedTasks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productivity Score</p>
              <p className="text-2xl font-bold text-indigo-600">{metrics.productivityScore}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Task Completion Trend
          </h3>
          {chartData.taskCompletion && (
            <Chart
              options={chartData.taskCompletion.options}
              series={chartData.taskCompletion.series}
              type="bar"
              height={350}
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Productivity Score
          </h3>
          {chartData.productivity && (
            <Chart
              options={chartData.productivity.options}
              series={chartData.productivity.series}
              type="line"
              height={350}
            />
          )}
        </motion.div>
      </div>

      {/* Recent Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Statistics
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tasks Completed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Productivity Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Time Spent</th>
              </tr>
            </thead>
            <tbody>
              {statistics.slice(0, 10).map(stat => (
                <tr key={stat.Id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {format(parseISO(stat.date), 'MMM d, yyyy')}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {stat.tasksCompleted}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stat.productivityScore >= 80 ? 'bg-green-100 text-green-800' :
                      stat.productivityScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {stat.productivityScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {Math.round(stat.timeSpent / 60)}h {stat.timeSpent % 60}m
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {statistics.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No statistics data yet. Generate your first stats to see productivity insights.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatisticsPage;