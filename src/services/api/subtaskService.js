import { toast } from 'react-toastify';

class SubtaskService {
  constructor() {
    this.tableName = 'subtask';
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
          { field: { Name: "completed" } },
          { field: { Name: "taskId" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "ASC"
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

      return response.data.map(subtask => ({
        Id: subtask.Id,
        Name: subtask.Name || '',
        completed: subtask.completed || false,
        taskId: subtask.taskId || null
      }));
    } catch (error) {
      console.error("Error fetching subtasks:", error);
      toast.error("Failed to load subtasks");
      return [];
    }
  }

  async getByTaskId(taskId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "completed" } },
          { field: { Name: "taskId" } }
        ],
        where: [
          {
            FieldName: "taskId",
            Operator: "EqualTo",
            Values: [taskId]
          }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(subtask => ({
        Id: subtask.Id,
        Name: subtask.Name || '',
        completed: subtask.completed || false,
        taskId: subtask.taskId || null
      }));
    } catch (error) {
      console.error("Error fetching subtasks for task:", error);
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
          { field: { Name: "completed" } },
          { field: { Name: "taskId" } }
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

      const subtask = response.data;
      return {
        Id: subtask.Id,
        Name: subtask.Name || '',
        completed: subtask.completed || false,
        taskId: subtask.taskId || null
      };
    } catch (error) {
      console.error(`Error fetching subtask with ID ${id}:`, error);
      toast.error("Failed to load subtask");
      return null;
    }
  }

  async create(subtaskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: subtaskData.Name || '',
          completed: false,
          taskId: subtaskData.taskId || null
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
          const newSubtask = successfulRecords[0].data;
          return {
            Id: newSubtask.Id,
            Name: newSubtask.Name || '',
            completed: newSubtask.completed || false,
            taskId: newSubtask.taskId || null
          };
        }
      }
      
      throw new Error("Failed to create subtask");
    } catch (error) {
      console.error("Error creating subtask:", error);
      throw error;
    }
  }

  async update(id, subtaskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const updateFields = { Id: id };
      
      if (subtaskData.Name !== undefined) {
        updateFields.Name = subtaskData.Name;
      }
      if (subtaskData.completed !== undefined) {
        updateFields.completed = subtaskData.completed;
      }
      if (subtaskData.taskId !== undefined) {
        updateFields.taskId = subtaskData.taskId;
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
          const updatedSubtask = successfulUpdates[0].data;
          return {
            Id: updatedSubtask.Id,
            Name: updatedSubtask.Name || '',
            completed: updatedSubtask.completed || false,
            taskId: updatedSubtask.taskId || null
          };
        }
      }
      
      throw new Error("Failed to update subtask");
    } catch (error) {
      console.error("Error updating subtask:", error);
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
      console.error("Error deleting subtask:", error);
      throw error;
    }
  }
}

export const subtaskService = new SubtaskService();