import { toast } from 'react-toastify';

class StatisticService {
  constructor() {
    this.tableName = 'statistic';
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
          { field: { Name: "productivityScore" } },
          { field: { Name: "tasksCompleted" } },
          { field: { Name: "timeSpent" } },
          { field: { Name: "date" } },
          { field: { Name: "userId" } }
        ],
        orderBy: [
          {
            fieldName: "date",
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

      return response.data.map(stat => ({
        Id: stat.Id,
        name: stat.Name || '',
        productivityScore: stat.productivityScore || 0,
        tasksCompleted: stat.tasksCompleted || 0,
        timeSpent: stat.timeSpent || 0,
        date: stat.date || new Date().toISOString().split('T')[0],
        userId: stat.userId || null
      }));
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error("Failed to load statistics");
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
          { field: { Name: "productivityScore" } },
          { field: { Name: "tasksCompleted" } },
          { field: { Name: "timeSpent" } },
          { field: { Name: "date" } },
          { field: { Name: "userId" } }
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

      const stat = response.data;
      return {
        Id: stat.Id,
        name: stat.Name || '',
        productivityScore: stat.productivityScore || 0,
        tasksCompleted: stat.tasksCompleted || 0,
        timeSpent: stat.timeSpent || 0,
        date: stat.date || new Date().toISOString().split('T')[0],
        userId: stat.userId || null
      };
    } catch (error) {
      console.error(`Error fetching statistic with ID ${id}:`, error);
      toast.error("Failed to load statistic");
      return null;
    }
  }

  async create(statisticData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: statisticData.name || `Statistics ${new Date().toLocaleDateString()}`,
          productivityScore: statisticData.productivityScore || 0,
          tasksCompleted: statisticData.tasksCompleted || 0,
          timeSpent: statisticData.timeSpent || 0,
          date: statisticData.date || new Date().toISOString().split('T')[0],
          userId: statisticData.userId || null
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
          const newStat = successfulRecords[0].data;
          return {
            Id: newStat.Id,
            name: newStat.Name || '',
            productivityScore: newStat.productivityScore || 0,
            tasksCompleted: newStat.tasksCompleted || 0,
            timeSpent: newStat.timeSpent || 0,
            date: newStat.date || new Date().toISOString().split('T')[0],
            userId: newStat.userId || null
          };
        }
      }
      
      throw new Error("Failed to create statistic");
    } catch (error) {
      console.error("Error creating statistic:", error);
      throw error;
    }
  }

  async update(id, statisticData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const updateFields = { Id: id };
      
      if (statisticData.name !== undefined) {
        updateFields.Name = statisticData.name;
      }
      if (statisticData.productivityScore !== undefined) {
        updateFields.productivityScore = statisticData.productivityScore;
      }
      if (statisticData.tasksCompleted !== undefined) {
        updateFields.tasksCompleted = statisticData.tasksCompleted;
      }
      if (statisticData.timeSpent !== undefined) {
        updateFields.timeSpent = statisticData.timeSpent;
      }
      if (statisticData.date !== undefined) {
        updateFields.date = statisticData.date;
      }
      if (statisticData.userId !== undefined) {
        updateFields.userId = statisticData.userId;
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
          const updatedStat = successfulUpdates[0].data;
          return {
            Id: updatedStat.Id,
            name: updatedStat.Name || '',
            productivityScore: updatedStat.productivityScore || 0,
            tasksCompleted: updatedStat.tasksCompleted || 0,
            timeSpent: updatedStat.timeSpent || 0,
            date: updatedStat.date || new Date().toISOString().split('T')[0],
            userId: updatedStat.userId || null
          };
        }
      }
      
      throw new Error("Failed to update statistic");
    } catch (error) {
      console.error("Error updating statistic:", error);
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
      console.error("Error deleting statistic:", error);
      throw error;
    }
  }
}

export const statisticService = new StatisticService();