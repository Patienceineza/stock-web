import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    onDateChange(start, end);
  };

  return (
    <div className="flex items-center space-x-2">
      <DatePicker
        selected={startDate}
        onChange={(date) => handleDateChange(date, endDate)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className="border p-2 rounded"
        placeholderText="Start Date"
      />
      <span className="text-gray-500">to</span>
      <DatePicker
        selected={endDate}
        onChange={(date) => handleDateChange(startDate, date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        className="border p-2 rounded"
        placeholderText="End Date"
      />
    </div>
  );
};

export default DateRangePicker;
