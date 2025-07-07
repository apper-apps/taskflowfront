import { toast } from 'react-toastify';

class CategoryService {
  constructor() {
    this.tableName = 'category';
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
          { field: { Name: "color" } },
          { field: { Name: "task_count" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
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

      // Map database fields to UI format
      return response.data.map(category => ({
        Id: category.Id,
        name: category.Name || '',
        color: category.color || '#5B46F0',
        taskCount: category.task_count || 0,
        createdAt: category.created_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
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
          { field: { Name: "color" } },
          { field: { Name: "task_count" } },
          { field: { Name: "created_at" } }
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
      const category = response.data;
      return {
        Id: category.Id,
        name: category.Name || '',
        color: category.color || '#5B46F0',
        taskCount: category.task_count || 0,
        createdAt: category.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      toast.error("Failed to load category");
      return null;
    }
  }

  async create(categoryData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Map UI fields to database fields (only Updateable fields)
      const params = {
        records: [{
          Name: categoryData.name || '',
          color: categoryData.color || '#5B46F0',
          task_count: 0,
          created_at: new Date().toISOString()
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
          const newCategory = successfulRecords[0].data;
          // Map back to UI format
          return {
            Id: newCategory.Id,
            name: newCategory.Name || '',
            color: newCategory.color || '#5B46F0',
            taskCount: newCategory.task_count || 0,
            createdAt: newCategory.created_at || new Date().toISOString()
          };
        }
      }
      
      throw new Error("Failed to create category");
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async update(id, categoryData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Map UI fields to database fields (only Updateable fields)
      const updateFields = {
        Id: id
      };
      
      if (categoryData.name !== undefined) {
        updateFields.Name = categoryData.name;
      }
      if (categoryData.color !== undefined) {
        updateFields.color = categoryData.color;
      }
      if (categoryData.taskCount !== undefined) {
        updateFields.task_count = categoryData.taskCount;
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
          const updatedCategory = successfulUpdates[0].data;
          // Map back to UI format
          return {
            Id: updatedCategory.Id,
            name: updatedCategory.Name || '',
            color: updatedCategory.color || '#5B46F0',
            taskCount: updatedCategory.task_count || 0,
            createdAt: updatedCategory.created_at || new Date().toISOString()
          };
        }
      }
      
      throw new Error("Failed to update category");
    } catch (error) {
      console.error("Error updating category:", error);
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
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();