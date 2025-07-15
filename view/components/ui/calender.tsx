'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate?.getMonth() ?? new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    selectedDate?.getFullYear() ?? new Date().getFullYear()
  );

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentMonth, currentYear]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentMonth, currentYear]);

  const calendarDays = useMemo(() => {
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [firstDayOfMonth, daysInMonth]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    onDateSelect?.(date);
  };

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  return (
    <div className='w-80 bg-white border border-gray-200 rounded-lg shadow-sm p-4'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <button
          onClick={() => navigateMonth('prev')}
          className='p-1 hover:bg-gray-100 rounded transition-colors'
        >
          <ChevronLeft className='size-5' />
        </button>

        <div className='flex items-center gap-2'>
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className='border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {monthNames.map((month, index) => (
              <option
                key={month}
                value={index}
              >
                {month}
              </option>
            ))}
          </select>

          <input
            type='number'
            value={currentYear}
            onChange={(e) =>
              setCurrentYear(parseInt(e.target.value) || currentYear)
            }
            className='border border-gray-300 rounded px-2 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500'
            min='1900'
            max='2100'
          />
        </div>

        <button
          onClick={() => navigateMonth('next')}
          className='p-1 hover:bg-gray-100 rounded transition-colors'
        >
          <ChevronRight className='size-5' />
        </button>
      </div>

      {/* Days of week header */}
      <div className='grid grid-cols-7 gap-1 mb-2'>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div
            key={day}
            className='text-center text-sm font-medium text-gray-500 py-2'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className='grid grid-cols-7 gap-1'>
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className='aspect-square'
          >
            {day && (
              <button
                onClick={() => handleDateClick(day)}
                className={`
                  w-full h-full flex items-center justify-center text-sm rounded transition-colors
                  ${
                    isSelectedDate(day)
                      ? 'bg-blue-500 text-white'
                      : isToday(day)
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-gray-100'
                  }
                `}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
