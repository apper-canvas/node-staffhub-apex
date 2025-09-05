import { useState, useEffect } from "react";
import { useEmployees } from "@/hooks/useEmployees";
import { useAttendance } from "@/hooks/useAttendance";
import { useLeave } from "@/hooks/useLeave";
import StatCard from "@/components/molecules/StatCard";
import QuickActions from "@/components/organisms/QuickActions";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Chart from "react-apexcharts";
import { format } from "date-fns";

const Dashboard = () => {
  const { employees, loading: employeesLoading, error: employeesError } = useEmployees();
  const { attendance, loading: attendanceLoading, error: attendanceError } = useAttendance();
  const { leaveRequests, loading: leaveLoading, error: leaveError } = useLeave();

  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingRequests: 0
  });

  const loading = employeesLoading || attendanceLoading || leaveLoading;
  const error = employeesError || attendanceError || leaveError;

useEffect(() => {
    if (employees.length && attendance.length && leaveRequests.length) {
      const today = format(new Date(), "yyyy-MM-dd");
      const todayAttendance = attendance.filter(record => record.date_c === today);
      const presentCount = todayAttendance.filter(record => 
        record.status_c === "present" || record.status_c === "late"
      ).length;
      const onLeaveCount = todayAttendance.filter(record => record.status_c === "leave").length;
      const pendingCount = leaveRequests.filter(req => req.status_c === "pending").length;

      setDashboardStats({
        totalEmployees: employees.length,
        presentToday: presentCount,
        onLeave: onLeaveCount,
        pendingRequests: pendingCount
      });
    }
  }, [employees, attendance, leaveRequests]);
  // Chart data for attendance trends
  const chartData = {
    series: [{
      name: "Present",
      data: [85, 90, 88, 92, 87, 89, 91]
    }, {
      name: "Absent",
      data: [15, 10, 12, 8, 13, 11, 9]
    }],
    options: {
      chart: {
        type: "line",
        height: 350,
        toolbar: { show: false }
      },
      colors: ["#2563EB", "#EF4444"],
      stroke: {
        width: 3,
        curve: "smooth"
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      grid: {
        borderColor: "#f1f5f9"
      },
      legend: {
        position: "top"
      }
    }
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load dashboard data" 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={dashboardStats.totalEmployees}
          icon="Users"
          gradient={true}
        />
        <StatCard
          title="Present Today"
          value={dashboardStats.presentToday}
          icon="CheckCircle"
          trend="up"
          trendValue="+5% from yesterday"
        />
        <StatCard
          title="On Leave"
          value={dashboardStats.onLeave}
          icon="Calendar"
          trend="down"
          trendValue="-2 from yesterday"
        />
        <StatCard
          title="Pending Requests"
          value={dashboardStats.pendingRequests}
          icon="Clock"
          trend="up"
          trendValue="+3 new requests"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 font-display">
              Weekly Attendance Trends
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="TrendingUp" className="w-4 h-4" />
              <span>This Week</span>
            </div>
          </div>
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={300}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions onActionComplete={() => {}} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 font-display">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                id: 1,
                type: "attendance",
                message: "John Smith clocked in",
                time: "9:00 AM",
                icon: "Clock"
              },
              {
                id: 2,
                type: "leave",
                message: "Emily Davis requested vacation leave",
                time: "8:45 AM",
                icon: "Calendar"
              },
              {
                id: 3,
                type: "attendance",
                message: "Sarah Johnson clocked out",
                time: "5:30 PM",
                icon: "LogOut"
              },
              {
                id: 4,
                type: "system",
                message: "Daily attendance report generated",
                time: "6:00 PM",
                icon: "FileText"
              }
            ].map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="p-2 bg-gray-100 rounded-full">
                  <ApperIcon name={activity.icon} className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-600">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;