import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useEmployees } from "@/hooks/useEmployees";
import EmployeeCard from "@/components/organisms/EmployeeCard";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";

const Employees = () => {
  const { employees, loading, error, searchEmployees, deleteEmployee } = useEmployees();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

// Get unique departments for filter
  const departments = [...new Set((employees || []).map(emp => emp?.department_c).filter(Boolean))].map(dept => ({
    value: dept,
    label: dept
  }));

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  // Filter employees based on search and filters
// Filter employees based on search and filters
  useEffect(() => {
    let filtered = employees;

    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department_c === departmentFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(emp => emp.status_c === statusFilter);
    }

    setFilteredEmployees(filtered);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchEmployees(query);
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await deleteEmployee(employee.Id);
        toast.success("Employee deleted successfully");
      } catch (err) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleEditEmployee = (employee) => {
    // TODO: Implement edit functionality
    toast.info("Edit functionality coming soon");
  };

  const handleViewProfile = (employee) => {
    // TODO: Implement view profile functionality
    toast.info("Profile view coming soon");
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load employees" 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your team members</p>
        </div>
        <Button icon="Plus">
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search employees..."
            />
          </div>
          <div className="flex gap-4">
            <FilterDropdown
              label="Department"
              options={departments}
              value={departmentFilter}
              onChange={setDepartmentFilter}
            />
            <FilterDropdown
              label="Status"
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.Id}
              employee={employee}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No employees found"
          description="No employees match your current search and filter criteria"
          icon="Users"
          action={
            <Button
              onClick={() => {
                setSearchQuery("");
                setDepartmentFilter("");
                setStatusFilter("");
              }}
            >
              Clear Filters
            </Button>
          }
        />
      )}

      {/* Summary Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
          Employee Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
<div>
            <div className="text-2xl font-bold text-primary">{(employees || []).length}</div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
<div>
            <div className="text-2xl font-bold text-success">
              {(employees || []).filter(emp => emp?.status_c === "active").length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-error">
              {(employees || []).filter(emp => emp?.status_c === "inactive").length}
            </div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">{departments?.length || 0}</div>
            <div className="text-sm text-gray-600">Departments</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;