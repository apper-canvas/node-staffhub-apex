const tableName = "employee_c";

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const employeesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching employees:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching employee:", response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching employee:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async create(employeeData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: employeeData.Name || `${employeeData.first_name_c} ${employeeData.last_name_c}`,
          first_name_c: employeeData.first_name_c,
          last_name_c: employeeData.last_name_c,
          email_c: employeeData.email_c,
          phone_c: employeeData.phone_c,
          role_c: employeeData.role_c,
          department_c: employeeData.department_c,
          join_date_c: employeeData.join_date_c,
          status_c: employeeData.status_c || "active",
          photo_url_c: employeeData.photo_url_c
        }]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error("Error creating employee:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create employee:`, failed);
          throw new Error(failed[0].message || "Failed to create employee");
        }
        return response.results[0].data;
      }

      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating employee:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, employeeData) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields that are provided
      if (employeeData.Name !== undefined) updateData.Name = employeeData.Name;
      if (employeeData.first_name_c !== undefined) updateData.first_name_c = employeeData.first_name_c;
      if (employeeData.last_name_c !== undefined) updateData.last_name_c = employeeData.last_name_c;
      if (employeeData.email_c !== undefined) updateData.email_c = employeeData.email_c;
      if (employeeData.phone_c !== undefined) updateData.phone_c = employeeData.phone_c;
      if (employeeData.role_c !== undefined) updateData.role_c = employeeData.role_c;
      if (employeeData.department_c !== undefined) updateData.department_c = employeeData.department_c;
      if (employeeData.join_date_c !== undefined) updateData.join_date_c = employeeData.join_date_c;
      if (employeeData.status_c !== undefined) updateData.status_c = employeeData.status_c;
      if (employeeData.photo_url_c !== undefined) updateData.photo_url_c = employeeData.photo_url_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error("Error updating employee:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update employee:`, failed);
          throw new Error(failed[0].message || "Employee not found");
        }
        return response.results[0].data;
      }

      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error("Error updating employee:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (!response.success) {
        console.error("Error deleting employee:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete employee:`, failed);
          throw new Error(failed[0].message || "Employee not found");
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting employee:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getByDepartment(department) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}}
        ],
        where: [{"FieldName": "department_c", "Operator": "EqualTo", "Values": [department], "Include": true}],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching employees by department:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching employees by department:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async search(query) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "join_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "first_name_c", "operator": "Contains", "values": [query]},
                {"fieldName": "last_name_c", "operator": "Contains", "values": [query]},
                {"fieldName": "email_c", "operator": "Contains", "values": [query]},
                {"fieldName": "department_c", "operator": "Contains", "values": [query]},
                {"fieldName": "role_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error searching employees:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching employees:", error?.response?.data?.message || error.message);
      return [];
    }
  }
};