import React, { useEffect, useMemo, useState } from 'react';

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const formatDisplayDate = (value) => {
  if (!value) return 'Select date';
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return value;
  }
};

const toISO = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const clampMin = (min) => (min ? new Date(min) : null);

const buildCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(year, month, day));
  }
  return cells;
};

const CalendarPopover = ({
  open,
  onClose,
  value,
  onSelect,
  min,
}) => {
  const selected = value ? new Date(value) : new Date();
  const [viewMonth, setViewMonth] = useState(selected.getMonth());
  const [viewYear, setViewYear] = useState(selected.getFullYear());

  useEffect(() => {
    if (!open) return;
    const current = value ? new Date(value) : new Date();
    setViewMonth(current.getMonth());
    setViewYear(current.getFullYear());
  }, [open, value]);

  const cells = useMemo(
    () => buildCalendar(viewYear, viewMonth),
    [viewMonth, viewYear]
  );
  const minDate = clampMin(min);

  const handleSelect = (dateObj) => {
    if (!dateObj) return;
    if (minDate && dateObj < minDate) return;
    onSelect?.(toISO(dateObj));
    onClose?.();
  };

  const goPrevMonth = () => {
    setViewMonth((prev) => {
      if (prev === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goNextMonth = () => {
    setViewMonth((prev) => {
      if (prev === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  if (!open) return null;

  return (
    <div className="absolute inset-x-0 top-full z-20 mt-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3">
        <button
          type="button"
          onClick={goPrevMonth}
          className="rounded-full bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-700">
          {new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <button
          type="button"
          onClick={goNextMonth}
          className="rounded-full bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-500">
        {weekdays.map((day) => (
          <div key={day} className="py-1 text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1 text-sm">
        {cells.map((dateObj, idx) => {
          if (!dateObj) {
            return <div key={`empty-${idx}`} />;
          }
          const iso = toISO(dateObj);
          const isBeforeMin = minDate && dateObj < minDate;
          const isSelected = value === iso;
          return (
            <button
              key={iso}
              type="button"
              disabled={isBeforeMin}
              onClick={() => handleSelect(dateObj)}
              className={`rounded-lg px-1 py-2 text-center transition ${
                isSelected
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                  : isBeforeMin
                  ? 'cursor-not-allowed text-gray-300'
                  : 'text-gray-700 hover:bg-indigo-50'
              }`}
            >
              {dateObj.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const DateButton = ({ label, value, onOpen, isHero }) => (
  <button
    type="button"
    onClick={onOpen}
    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition shadow-sm ${
      isHero
        ? 'border border-white/30 bg-white/10 text-white hover:bg-white/20'
        : 'border border-gray-200 bg-white text-gray-800 hover:border-indigo-200 hover:shadow'
    }`}
  >
    <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
      {label}
    </span>
    <span className="text-sm font-medium">
      {formatDisplayDate(value)}
    </span>
  </button>
);

export function SingleDatePicker({
  value,
  onChange,
  label = 'Select date',
  min,
  variant = 'default',
  required = true,
}) {
  const [open, setOpen] = useState(false);
  const handleSelect = (next) => {
    onChange?.(next);
    setOpen(false);
  };

  return (
    <div className="relative">
      <DateButton label={label} value={value} onOpen={() => setOpen(true)} isHero={variant === 'hero'} />
      <CalendarPopover open={open} onClose={() => setOpen(false)} value={value} onSelect={handleSelect} min={min} />
      {!required && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          className="mt-2 text-xs font-medium text-gray-400 hover:text-gray-600"
        >
          Clear date
        </button>
      )}
    </div>
  );
}

export const DateRangePicker = ({
  value = {},
  onChange,
  min,
  variant = 'default',
}) => {
  const [openField, setOpenField] = useState(null);
  const [range, setRange] = useState({ start: value.start || '', end: value.end || '' });

  useEffect(() => {
    setRange({ start: value.start || '', end: value.end || '' });
  }, [value.start, value.end]);

  const handleSelect = (field) => (next) => {
    const updated = { ...range, [field]: next };
    if (field === 'start' && updated.end && updated.end < next) {
      updated.end = next;
    }
    setRange(updated);
    onChange?.(updated);
    setOpenField(field === 'start' ? 'end' : null);
  };

  const isHero = variant === 'hero';

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="relative">
        <DateButton
          label="Check-in"
          value={range.start}
          onOpen={() => setOpenField('start')}
          isHero={isHero}
        />
        <CalendarPopover
          open={openField === 'start'}
          onClose={() => setOpenField(null)}
          value={range.start}
          onSelect={handleSelect('start')}
          min={min}
        />
      </div>
      <div className="relative">
        <DateButton
          label="Check-out"
          value={range.end}
          onOpen={() => setOpenField('end')}
          isHero={isHero}
        />
        <CalendarPopover
          open={openField === 'end'}
          onClose={() => setOpenField(null)}
          value={range.end}
          onSelect={handleSelect('end')}
          min={range.start || min}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
