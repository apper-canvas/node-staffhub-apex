import { useState } from "react";
import { toast } from "react-toastify";
import { useAttendance } from "@/hooks/useAttendance";
import { useEmployees } from "@/hooks/useEmployees";
import AttendanceTable from "@/components/organisms/AttendanceTable";
import StatCard from "@/components/molecules/StatCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { format } from "date-fns";

const Attendance = () => {
  const { attendance, loading, error, updateAttendanceStatus } = useAttendance();
  const { employees } = useEmployees();
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);

const todayAttendance = attendance.filter(record => 
    format(new Date(record.date_c), "yyyy-MM-dd") === selectedDate
  );

  const stats = {
present: todayAttendance.filter(record => record.status_c === "present").length,
    absent: todayAttendance.filter(record => record.status_c === "absent").length,
    late: todayAttendance.filter(record => record.status_c === "late").length,
    onLeave: todayAttendance.filter(record => record.status_c === "leave").length
  };

  const handleUpdateStatus = async (recordId, newStatus) => {
    try {
      await updateAttendanceStatus(recordId, newStatus);
      toast.success("Attendance status updated successfully");
    } catch (err) {
      toast.error("Failed to update attendance status");
    }
  };

  const handleMarkAllPresent = () => {
    toast.info("Mark all present functionality coming soon");
  };

  const handleGenerateReport = () => {
    toast.info("Generate report functionality coming soon");
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load attendance data" 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Attendance</h1>
          <p className="text-gray-600 mt-1">Track employee attendance and working hours</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon="CheckSquare"
            onClick={handleMarkAllPresent}
          >
            Mark All Present
          </Button>
          <Button
            icon="FileText"
            onClick={handleGenerateReport}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="Present"
          value={stats.present}
          icon="CheckCircle"
          className="border-success/20 bg-success/5"
        />
        <StatCard
          title="Absent"
          value={stats.absent}
          icon="XCircle"
          className="border-error/20 bg-error/5"
        />
        <StatCard
          title="Late"
          value={stats.late}
          icon="Clock"
          className="border-warning/20 bg-warning/5"
        />
        <StatCard
          title="On Leave"
          value={stats.onLeave}
          icon="Calendar"
          className="border-accent/20 bg-accent/5"
        />
      </div>

      {/* Attendance Table */}
      <AttendanceTable
        attendanceData={attendance}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
            Department Attendance
          </h3>
          <div className="space-y-4">
            {["Engineering", "Product", "Design", "Marketing", "Sales"].map((dept) => {
const deptAttendance = todayAttendance.filter(record => record.department_c === dept);
              const presentCount = deptAttendance.filter(record => 
                record.status === "present" || record.status === "late"
              ).length;
              const totalCount = deptAttendance.length;
              const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

              return (
                <div key={dept} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{dept}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {presentCount}/{totalCount}
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
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

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
            Recent Clock-ins
          </h3>
          <div className="space-y-3">
            {todayAttendance
.filter(record => record.check_in_c && record.status_c === "present")
              .slice(0, 5)
              .map((record) => (
<div key={record.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{record.employee_name_c}</div>
                    <div className="text-sm text-gray-600">{record.department_c}</div>
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {new Date(`1970-01-01T${record.checkIn}`).toLocaleTimeString([], { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;