import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const LeaveRequestForm = ({ onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    employee_id_c: "",
    employee_name_c: "",
    type_c: "",
    start_date_c: "",
    end_date_c: "",
    reason_c: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const leaveTypes = [
    { value: "vacation", label: "Vacation" },
    { value: "sick", label: "Sick Leave" },
    { value: "personal", label: "Personal" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
// Validation
    if (!formData.employee_id_c || !formData.type_c || !formData.start_date_c || !formData.end_date_c) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    setIsSubmitting(true);

try {
      const newRequest = {
        employee_id_c: formData.employee_id_c,
        employee_name_c: formData.employee_name_c,
        type_c: formData.type_c,
        start_date_c: formData.start_date_c,
        end_date_c: formData.end_date_c,
        reason_c: formData.reason_c,
        status_c: "pending",
        approved_by_c: null
      };

      if (onSubmit) {
        await onSubmit(newRequest);
      }

      toast.success("Leave request submitted successfully");
      
      // Reset form
setFormData({
        employee_id_c: "",
        employee_name_c: "",
        type_c: "",
        start_date_c: "",
        end_date_c: "",
        reason_c: ""
      });
    } catch (error) {
      toast.error("Failed to submit leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 font-display">
          Submit Leave Request
        </h2>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Employee ID"
            type="text"
value={formData.employee_id_c}
            onChange={(e) => handleInputChange("employee_id_c", e.target.value)}
            placeholder="Enter employee ID"
            required
          />

          <Select
            label="Leave Type"
value={formData.type_c}
            onChange={(e) => handleInputChange("type_c", e.target.value)}
            required
          >
            <option value="">Select leave type</option>
            {leaveTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Start Date"
            type="date"
value={formData.start_date_c}
            onChange={(e) => handleInputChange("start_date_c", e.target.value)}
            required
          />

          <Input
label="End Date"
            type="date"
            value={formData.end_date_c}
            onChange={(e) => handleInputChange("end_date_c", e.target.value)}
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <textarea
            value={formData.reason}
value={formData.reason_c}
            onChange={(e) => handleInputChange("reason_c", e.target.value)}
            rows={4}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            placeholder="Please provide reason for leave request..."
          />
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;