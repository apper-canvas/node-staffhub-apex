import React, { useState } from "react";
import { toast } from "react-toastify";
import { useLeave } from "@/hooks/useLeave";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import LeaveRequestForm from "@/components/organisms/LeaveRequestForm";
import StatusBadge from "@/components/molecules/StatusBadge";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const Leave = () => {
  const { 
    leaveRequests, 
    loading, 
    error, 
    createLeaveRequest, 
    approveLeaveRequest, 
    rejectLeaveRequest,
    getPendingRequests
  } = useLeave();

  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

const filteredRequests = leaveRequests.filter(request => {
    if (activeTab === "all") return true;
    return request.status_c === activeTab;
  });

  const handleSubmitRequest = async (requestData) => {
    try {
      await createLeaveRequest(requestData);
      setShowForm(false);
      toast.success("Leave request submitted successfully");
    } catch (err) {
      toast.error("Failed to submit leave request");
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await approveLeaveRequest(requestId);
      toast.success("Leave request approved");
    } catch (err) {
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectLeaveRequest(requestId);
      toast.success("Leave request rejected");
    } catch (err) {
      toast.error("Failed to reject request");
    }
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load leave requests" 
        onRetry={() => window.location.reload()} 
      />
    );
  }

  const tabs = [
{ id: "all", label: "All Requests", count: leaveRequests.length },
    { id: "pending", label: "Pending", count: leaveRequests.filter(r => r.status_c === "pending").length },
    { id: "approved", label: "Approved", count: leaveRequests.filter(r => r.status_c === "approved").length },
    { id: "rejected", label: "Rejected", count: leaveRequests.filter(r => r.status_c === "rejected").length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Leave Management</h1>
          <p className="text-gray-600 mt-1">Manage employee leave requests and approvals</p>
        </div>
        <Button
          icon="Plus"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "New Request"}
        </Button>
      </div>

      {/* Leave Request Form */}
      {showForm && (
        <LeaveRequestForm
          onSubmit={handleSubmitRequest}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="font-medium">{tab.label}</span>
                <Badge variant={activeTab === tab.id ? "primary" : "default"}>
                  {tab.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="overflow-x-auto">
          {filteredRequests.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
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
                {filteredRequests.map((request) => (
<tr key={request.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.employee_name_c}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {request.employeeId}
                      </div>
                    </td>
<td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="accent">{request.type_c}</Badge>
                    </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{format(new Date(request.start_date_c), "MMM d, yyyy")}</div>
                      <div className="text-gray-500">
                        to {format(new Date(request.end_date_c), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
<StatusBadge status={request.status_c} type="leave" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
{request.status_c === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleApprove(request.Id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="error"
                            onClick={() => handleReject(request.Id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Eye"
                        className="ml-2"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Empty
              title="No leave requests found"
              description={`No ${activeTab === "all" ? "" : activeTab} leave requests to display`}
              icon="Calendar"
            />
          )}
        </div>
      </div>

      {/* Leave Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Pending Approvals
            </h3>
            <div className="p-2 bg-warning/10 rounded-full">
              <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
            </div>
          </div>
          <div className="text-3xl font-bold text-warning mb-2">
            {getPendingRequests().length}
          </div>
          <p className="text-sm text-gray-600">Require your attention</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              This Month
            </h3>
            <div className="p-2 bg-primary/10 rounded-full">
              <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold text-primary mb-2">
{leaveRequests.filter(r => {
              const requestDate = new Date(r.created_at_c);
              const now = new Date();
              return requestDate.getMonth() === now.getMonth() && 
                     requestDate.getFullYear() === now.getFullYear();
            }).length}
          </div>
          <p className="text-sm text-gray-600">Total requests</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              Approval Rate
            </h3>
            <div className="p-2 bg-success/10 rounded-full">
              <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="text-3xl font-bold text-success mb-2">
{leaveRequests.length > 0 
              ? Math.round((leaveRequests.filter(r => r.status_c === "approved").length / leaveRequests.length) * 100)
              : 0}%
          </div>
          <p className="text-sm text-gray-600">Requests approved</p>
        </div>
      </div>
    </div>
  );
};

export default Leave;