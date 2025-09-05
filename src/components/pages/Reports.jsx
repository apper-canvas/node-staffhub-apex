import { useState } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { useAttendance } from "@/hooks/useAttendance";
import { useLeave } from "@/hooks/useLeave";
import StatCard from "@/components/molecules/StatCard";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Chart from "react-apexcharts";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

const Reports = () => {
  const { employees, loading: employeesLoading, error: employeesError } = useEmployees();
  const { attendance, loading: attendanceLoading, error: attendanceError } = useAttendance();
  const { leaveRequests, loading: leaveLoading, error: leaveError } = useLeave();

  const [reportType, setReportType] = useState("attendance");
  const [dateRange, setDateRange] = useState("thisMonth");

  const loading = employeesLoading || attendanceLoading || leaveLoading;
  const error = employeesError || attendanceError || leaveError;

  // Attendance Chart Data
  const attendanceChartData = {
    series: [{
      name: "Present",
      data: [85, 90, 88, 92, 87, 89, 91, 94, 88, 90, 92, 89, 86, 91, 93]
    }, {
      name: "Absent",
      data: [10, 5, 8, 4, 9, 6, 4, 3, 7, 5, 4, 6, 8, 4, 3]
    }, {
      name: "Late",
      data: [5, 5, 4, 4, 4, 5, 5, 3, 5, 5, 4, 5, 6, 5, 4]
    }],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: { show: true }
      },
      colors: ["#2563EB", "#EF4444", "#F59E0B"],
      xaxis: {
        categories: Array.from({ length: 15 }, (_, i) => 
          format(subDays(new Date(), 14 - i), "MMM d")
        )
      },
      legend: {
        position: "top"
      },
      grid: {
        borderColor: "#f1f5f9"
      }
    }
  };

  // Department Distribution Chart
  const departmentChartData = {
    series: [25, 20, 15, 20, 10, 10],
    options: {
      chart: {
        type: "donut",
        height: 350
      },
      labels: ["Engineering", "Product", "Design", "Marketing", "Sales", "Others"],
      colors: ["#2563EB", "#7C3AED", "#14B8A6", "#F59E0B", "#EF4444", "#6B7280"],
      legend: {
        position: "bottom"
      }
    }
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load reports data" 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  const handleExport = (type) => {
    // Simulate export functionality
    const exportData = {
      attendance: "attendance_report.csv",
      leave: "leave_report.csv",
      employee: "employee_report.csv"
    };
    
    // Create a temporary link to simulate download
    const link = document.createElement("a");
    link.href = "#";
    link.download = exportData[type] || "report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Reports</h1>
          <p className="text-gray-600 mt-1">Analyze attendance patterns and workforce metrics</p>
        </div>
        <div className="flex gap-3">
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-40"
          >
            <option value="attendance">Attendance</option>
            <option value="leave">Leave</option>
            <option value="employee">Employee</option>
          </Select>
          <Button
            icon="Download"
            onClick={() => handleExport(reportType)}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Attendance"
          value="89.5%"
          icon="TrendingUp"
          trend="up"
          trendValue="+2.3% from last month"
        />
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon="Users"
          gradient={true}
        />
        <StatCard
          title="Leave Requests"
          value={leaveRequests.length}
          icon="Calendar"
          trend="up"
          trendValue="+5 this month"
        />
        <StatCard
          title="Departments"
value={[...new Set(employees.map(emp => emp.department_c))].length}
          icon="Building"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 font-display">
              Daily Attendance Trends
            </h2>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-32"
            >
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
            </Select>
          </div>
          <Chart
            options={attendanceChartData.options}
            series={attendanceChartData.series}
            type="bar"
            height={350}
          />
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 font-display mb-6">
            Employee Distribution by Department
          </h2>
          <Chart
            options={departmentChartData.options}
            series={departmentChartData.series}
            type="donut"
            height={350}
          />
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 font-display mb-6">
            Attendance Leaders
          </h2>
          <div className="space-y-4">
            {[
              { name: "Sarah Johnson", department: "Product", rate: 98.5 },
              { name: "John Smith", department: "Engineering", rate: 96.8 },
              { name: "Emily Davis", department: "Marketing", rate: 95.2 },
              { name: "David Wilson", department: "Engineering", rate: 94.7 },
              { name: "Lisa Miller", department: "HR", rate: 94.1 }
            ].map((employee, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-600">{employee.department}</div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-success">
                  {employee.rate}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 font-display mb-6">
            Recent Leave Analysis
          </h2>
          <div className="space-y-4">
            {["Vacation", "Sick Leave", "Personal", "Emergency", "Maternity"].map((type, index) => {
              const count = Math.floor(Math.random() * 10) + 1;
              const percentage = Math.floor(Math.random() * 30) + 10;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{type}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">{count} requests</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-10">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 font-display mb-6">
          Export Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            icon="FileText"
            className="justify-start"
            onClick={() => handleExport("attendance")}
          >
            <div className="text-left">
              <div className="font-medium">Attendance Report</div>
              <div className="text-sm text-gray-600">Daily attendance data</div>
            </div>
          </Button>
          <Button
            variant="outline"
            icon="Calendar"
            className="justify-start"
            onClick={() => handleExport("leave")}
          >
            <div className="text-left">
              <div className="font-medium">Leave Report</div>
              <div className="text-sm text-gray-600">Leave requests and balances</div>
            </div>
          </Button>
          <Button
            variant="outline"
            icon="Users"
            className="justify-start"
            onClick={() => handleExport("employee")}
          >
            <div className="text-left">
              <div className="font-medium">Employee Report</div>
              <div className="text-sm text-gray-600">Employee directory and info</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reports;