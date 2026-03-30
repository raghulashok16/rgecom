import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SelectDropdown — animated replacement for <select>.
 * props:
 *   value       — current value ('' for placeholder)
 *   onChange    — called with the selected value (string)
 *   options     — [{ value, label }]
 *   placeholder — string shown when value is ''
 *   className   — extra classes on the trigger button
 */
const SelectDropdown = ({ value, onChange, options, placeholder = 'Please select', className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => String(o.value) === String(value));

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 border border-gray-200 bg-white rounded-xl px-3 py-2 text-sm text-left cursor-pointer select-none hover:border-[#81A6C6] focus:border-[#81A6C6] transition-colors outline-none"
      >
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-gray-400 shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.92 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
            className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-52 overflow-y-auto"
          >
            {/* Placeholder option */}
            <li
              onClick={() => { onChange(''); setOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                value === '' ? 'bg-[#81A6C6] text-white font-medium' : 'text-gray-400 hover:bg-[#F3E3D0]'
              }`}
            >
              {placeholder}
            </li>
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => { onChange(String(opt.value)); setOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  String(opt.value) === String(value)
                    ? 'bg-[#81A6C6] text-white font-medium'
                    : 'text-gray-700 hover:bg-[#F3E3D0]'
                }`}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectDropdown;
