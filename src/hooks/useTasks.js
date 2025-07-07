import { useState, useEffect } from 'react';
import { taskService } from '@/services/api/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      throw new Error('Failed to add task');
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskService.update(id, taskData);
      setTasks(prev => prev.map(task => 
        task.Id === id ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      throw new Error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.Id !== id));
    } catch (err) {
      throw new Error('Failed to delete task');
    }
  };

  const toggleTaskComplete = async (id) => {
    try {
      const task = tasks.find(t => t.Id === id);
      if (!task) return;

      const updatedTask = await taskService.update(id, {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      });

      setTasks(prev => prev.map(t => 
        t.Id === id ? updatedTask : t
      ));
      return updatedTask;
    } catch (err) {
      throw new Error('Failed to update task');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    loadTasks
  };
};