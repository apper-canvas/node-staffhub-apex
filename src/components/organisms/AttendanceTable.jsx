import { useState } from "react";
import { format } from "date-fns";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AttendanceTable = ({ attendanceData, onMarkAttendance, onUpdateStatus }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

const filteredData = attendanceData.filter(record => 
    format(new Date(record.date_c), "yyyy-MM-dd") === selectedDate
  );

  const handleStatusChange = (recordId, newStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(recordId, newStatus);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "--:--";
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 font-display">
            Daily Attendance
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button
              icon="Download"
              variant="outline"
              size="sm"
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check Out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((record) => (
              <tr key={record.Id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar
fallback={record.employee_name_c}
                      size="sm"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
{record.employee_name_c}
                      </div>
<div className="text-sm text-gray-500">
                        {record.department_c}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
{formatTime(record.check_in_c)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
{formatTime(record.check_out_c)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
<StatusBadge status={record.status_c} type="attendance" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
{record.status_c === "absent" && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleStatusChange(record.Id, "present")}
                    >
                      Mark Present
                    </Button>
                  )}
{record.status_c === "present" && !record.check_out_c && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(record.Id, "checked-out")}
                    >
                      Check Out
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    icon="Edit"
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Calendar" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
          <p className="text-gray-600">No attendance data found for {format(new Date(selectedDate), "MMM d, yyyy")}</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;