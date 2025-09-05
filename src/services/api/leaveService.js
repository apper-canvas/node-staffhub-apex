const tableName = "leave_request_c";

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const leaveService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching leave requests:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching leave requests:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching leave request:", response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching leave request:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async create(leaveData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: leaveData.Name || `${leaveData.employee_name_c} - ${leaveData.type_c} Leave`,
          employee_id_c: parseInt(leaveData.employee_id_c),
          employee_name_c: leaveData.employee_name_c,
          type_c: leaveData.type_c,
          start_date_c: leaveData.start_date_c,
          end_date_c: leaveData.end_date_c,
          reason_c: leaveData.reason_c,
          status_c: leaveData.status_c || "pending",
          approved_by_c: leaveData.approved_by_c,
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error("Error creating leave request:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create leave request:`, failed);
          throw new Error(failed[0].message || "Failed to create leave request");
        }
        return response.results[0].data;
      }

      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating leave request:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, leaveData) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields that are provided
      if (leaveData.Name !== undefined) updateData.Name = leaveData.Name;
      if (leaveData.employee_id_c !== undefined) updateData.employee_id_c = parseInt(leaveData.employee_id_c);
      if (leaveData.employee_name_c !== undefined) updateData.employee_name_c = leaveData.employee_name_c;
      if (leaveData.type_c !== undefined) updateData.type_c = leaveData.type_c;
      if (leaveData.start_date_c !== undefined) updateData.start_date_c = leaveData.start_date_c;
      if (leaveData.end_date_c !== undefined) updateData.end_date_c = leaveData.end_date_c;
      if (leaveData.reason_c !== undefined) updateData.reason_c = leaveData.reason_c;
      if (leaveData.status_c !== undefined) updateData.status_c = leaveData.status_c;
      if (leaveData.approved_by_c !== undefined) updateData.approved_by_c = leaveData.approved_by_c;
      if (leaveData.created_at_c !== undefined) updateData.created_at_c = leaveData.created_at_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error("Error updating leave request:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update leave request:`, failed);
          throw new Error(failed[0].message || "Leave request not found");
        }
        return response.results[0].data;
      }

      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error("Error updating leave request:", error?.response?.data?.message || error.message);
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
        console.error("Error deleting leave request:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete leave request:`, failed);
          throw new Error(failed[0].message || "Leave request not found");
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting leave request:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getByEmployee(employeeId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [{"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)], "Include": true}],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching leave requests by employee:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching leave requests by employee:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getByStatus(status) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "reason_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "approved_by_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status], "Include": true}],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching leave requests by status:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching leave requests by status:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async approve(id, approvedBy) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: "approved",
          approved_by_c: approvedBy
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error("Error approving leave request:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to approve leave request:`, failed);
          throw new Error(failed[0].message || "Leave request not found");
        }
        return response.results[0].data;
      }

      throw new Error("No results returned from approve operation");
    } catch (error) {
      console.error("Error approving leave request:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async reject(id, approvedBy) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: "rejected",
          approved_by_c: approvedBy
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error("Error rejecting leave request:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to reject leave request:`, failed);
          throw new Error(failed[0].message || "Leave request not found");
        }
        return response.results[0].data;
      }

      throw new Error("No results returned from reject operation");
    } catch (error) {
      console.error("Error rejecting leave request:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};