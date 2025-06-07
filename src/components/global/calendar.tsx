import { useState } from "react";
import { Button } from "../ui/button";

type Props = {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
};

const Calendar = ({ date, setDate }: Props) => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  // Calculate days in the current month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const days: { day: number; isInactive: boolean }[] = [];

  // Add previous month's trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isInactive: true });
  }

  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isInactive: false });
  }

  // Add next month's leading days to fill the grid
  const totalDays = days.length;
  const remainingDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ day: i, isInactive: true });
  }

  // Handle month navigation
  const handlePrevMonth = () => {
    setMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setYear((prev) => (month === 0 ? prev - 1 : prev));
    setDate("1"); // Reset to first day of new month
  };

  const handleNextMonth = () => {
    setMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setYear((prev) => (month === 11 ? prev + 1 : prev));
    setDate("1"); // Reset to first day of new month
  };

  return (
    <div>
      <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {monthNames[month]} {year}
          </h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <i className="ri-arrow-left-s-line h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <i className="ri-arrow-right-s-line h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="mb-2 grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((dayObj, index) => {
            const isSelected = !dayObj.isInactive && dayObj.day.toString() === date;
            const isToday =
              !dayObj.isInactive &&
              dayObj.day === currentDay &&
              month === currentMonth &&
              year === currentYear;
            return (
              <Button
                key={index}
                variant={isSelected ? "default" : dayObj.isInactive ? "ghost" : "outline"}
                className={`aspect-square ${isToday ? "border-2 border-blue-500 font-bold" : ""}`}
                onClick={() => !dayObj.isInactive && setDate(dayObj.day.toString())}
                disabled={dayObj.isInactive}
              >
                {dayObj.day}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;