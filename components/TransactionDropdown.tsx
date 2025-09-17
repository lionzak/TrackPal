import React from 'react'

const TransactionDropdown = ({title, options, optionsValue, onChange}: {title: string, options: string[], optionsValue: string[], onChange: (value: string) => void}) => {
  return (
    <div>
      <select
        className="border border-gray-300 rounded-lg py-4 px-4 w-full hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        defaultValue=""
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>{title}</option>
        {options.map((option, index) => (
          <option  key={option} value={optionsValue[index]}>{option}</option>
        ))}
      </select>
    </div>
  )
}

export default TransactionDropdown
