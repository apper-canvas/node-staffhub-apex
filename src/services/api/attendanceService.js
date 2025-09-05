const tableName = "attendance_c";

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const attendanceService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching attendance:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data?.message || error.message);
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
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error("Error fetching attendance record:", response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching attendance record:", error?.response?.data?.message || error.message);
      return null;
    }
  },

  async create(attendanceData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Name: attendanceData.Name || `${attendanceData.employee_name_c} - ${attendanceData.date_c}`,
          employee_id_c: parseInt(attendanceData.employee_id_c),
          employee_name_c: attendanceData.employee_name_c,
          department_c: attendanceData.department_c,
          date_c: attendanceData.date_c,
          check_in_c: attendanceData.check_in_c,
          check_out_c: attendanceData.check_out_c,
          status_c: attendanceData.status_c || "present",
          notes_c: attendanceData.notes_c || ""
        }]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error("Error creating attendance record:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create attendance record:`, failed);
          throw new Error(failed[0].message || "Failed to create attendance record");
        }
        return response.results[0].data;
      }

      throw new Error("No results returned from create operation");
    } catch (error) {
      console.error("Error creating attendance record:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, attendanceData) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields that are provided
      if (attendanceData.Name !== undefined) updateData.Name = attendanceData.Name;
      if (attendanceData.employee_id_c !== undefined) updateData.employee_id_c = parseInt(attendanceData.employee_id_c);
      if (attendanceData.employee_name_c !== undefined) updateData.employee_name_c = attendanceData.employee_name_c;
      if (attendanceData.department_c !== undefined) updateData.department_c = attendanceData.department_c;
      if (attendanceData.date_c !== undefined) updateData.date_c = attendanceData.date_c;
      if (attendanceData.check_in_c !== undefined) updateData.check_in_c = attendanceData.check_in_c;
      if (attendanceData.check_out_c !== undefined) updateData.check_out_c = attendanceData.check_out_c;
      if (attendanceData.status_c !== undefined) updateData.status_c = attendanceData.status_c;
      if (attendanceData.notes_c !== undefined) updateData.notes_c = attendanceData.notes_c;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error("Error updating attendance record:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update attendance record:`, failed);
          throw new Error(failed[0].message || "Attendance record not found");
        }
        return response.results[0].data;
      }

      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error("Error updating attendance record:", error?.response?.data?.message || error.message);
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
        console.error("Error deleting attendance record:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete attendance record:`, failed);
          throw new Error(failed[0].message || "Attendance record not found");
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting attendance record:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getByDate(date) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "employee_id_c"}},
          {"field": {"Name": "employee_name_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "EqualTo", "Values": [date], "Include": true}],
        orderBy: [{"fieldName": "employee_name_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching attendance by date:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by date:", error?.response?.data?.message || error.message);
      return [];
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
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "check_in_c"}},
          {"field": {"Name": "check_out_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "employee_id_c", "Operator": "EqualTo", "Values": [parseInt(employeeId)], "Include": true}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching attendance by employee:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by employee:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async updateStatus(id, status) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error("Error updating attendance status:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update attendance status:`, failed);
          throw new Error(failed[0].message || "Attendance record not found");
        }
        return response.results[0].data;
      }

      throw new Error("No results returned from update operation");
    } catch (error) {
      console.error("Error updating attendance status:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};