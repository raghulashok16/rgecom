import { useState } from 'react';

const FormInput = ({ type = 'text', value, onChange, placeholder, error, wrapperClass }) => {
  const [focused, setFocused] = useState(false);
  const floated = focused || !!value;

  return (
    <div className={wrapperClass || 'mb-3'}>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=""
          className={`w-full h-12 px-3 pt-5 pb-1 rounded-xl border text-sm outline-none transition-colors duration-200
            bg-gray-50 text-gray-900
            ${focused ? 'border-indigo-400' : 'border-gray-200'}
          `}
        />
        <label
          className={`absolute left-3 pointer-events-none transition-all duration-200 ease-out
            ${floated
              ? 'top-2 text-[10px] text-indigo-500'
              : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
            }
          `}
        >
          {placeholder}
        </label>
      </div>
      {error && <p className="text-red-500 text-xs mt-1 pl-1">{error}</p>}
    </div>
  );
};

export default FormInput;
