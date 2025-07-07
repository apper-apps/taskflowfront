import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

class TaskService {
  constructor() {
    this.tableName = 'task';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "category_id" } },
          { field: { Name: "notes" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }
// Map database fields to UI format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title || task.Name || '',
        completed: task.completed || false,
        categoryId: task.category_id || null,
        priority: task.priority || 'medium',
        dueDate: task.due_date || null,
        createdAt: task.created_at || new Date().toISOString(),
        completedAt: task.completed_at || null,
        notes: task.notes || ''
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      return [];
    }
  }

  async getById(id) {
    try {
if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "completed" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "completed_at" } },
          { field: { Name: "category_id" } },
          { field: { Name: "notes" } }
        ]
      };
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

// Map database fields to UI format
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title || task.Name || '',
        completed: task.completed || false,
        categoryId: task.category_id || null,
        priority: task.priority || 'medium',
        dueDate: task.due_date || null,
        createdAt: task.created_at || new Date().toISOString(),
        completedAt: task.completed_at || null,
        notes: task.notes || ''
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      toast.error("Failed to load task");
      return null;
    }
  }

  async create(taskData) {
    try {
if (!this.apperClient) this.initializeClient();
      
      // Map UI fields to database fields (only Updateable fields)
      const params = {
records: [{
          Name: taskData.title || '',
          title: taskData.title || '',
          completed: false,
          priority: taskData.priority || 'medium',
          due_date: taskData.dueDate || null,
          created_at: new Date().toISOString(),
          completed_at: null,
          category_id: taskData.categoryId ? parseInt(taskData.categoryId, 10) : null,
          notes: taskData.notes || ''
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
if (successfulRecords.length > 0) {
          const newTask = successfulRecords[0].data;
          // Map back to UI format
          return {
            Id: newTask.Id,
            title: newTask.title || newTask.Name || '',
            completed: newTask.completed || false,
            categoryId: newTask.category_id || null,
            priority: newTask.priority || 'medium',
            dueDate: newTask.due_date || null,
            createdAt: newTask.created_at || new Date().toISOString(),
            completedAt: newTask.completed_at || null,
            notes: newTask.notes || ''
          };
        }
      }
      
      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Map UI fields to database fields (only Updateable fields)
const updateFields = {
        Id: id
      };
      
      if (taskData.title !== undefined) {
        updateFields.Name = taskData.title;
        updateFields.title = taskData.title;
      }
      if (taskData.completed !== undefined) {
        updateFields.completed = taskData.completed;
      }
      if (taskData.priority !== undefined) {
        updateFields.priority = taskData.priority;
      }
      if (taskData.dueDate !== undefined) {
        updateFields.due_date = taskData.dueDate;
      }
      if (taskData.completedAt !== undefined) {
        updateFields.completed_at = taskData.completedAt;
      }
      if (taskData.categoryId !== undefined) {
        updateFields.category_id = taskData.categoryId ? parseInt(taskData.categoryId, 10) : null;
      }
      if (taskData.notes !== undefined) {
        updateFields.notes = taskData.notes;
      }

      const params = {
        records: [updateFields]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          // Map back to UI format
          return {
            Id: updatedTask.Id,
            title: updatedTask.title || updatedTask.Name || '',
            completed: updatedTask.completed || false,
            categoryId: updatedTask.category_id || null,
            priority: updatedTask.priority || 'medium',
            dueDate: updatedTask.due_date || null,
            createdAt: updatedTask.created_at || new Date().toISOString(),
            completedAt: updatedTask.completed_at || null,
            notes: updatedTask.notes || ''
          };
        }
      }
      
      throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export const taskService = new TaskService();