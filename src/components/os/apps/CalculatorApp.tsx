"use client";

import React, { useState } from 'react';
import { toast } from 'sonner'; // Import toast for notifications

const CalculatorApp: React.FC = () => {
  const [currentInput, setCurrentInput] = useState('0');
  const [previousInput, setPreviousInput] = useState('');
  const [operator, setOperator] = useState<string | null>(null);

  const updateDisplay = (value: string) => {
    setCurrentInput(value);
  };

  const appendNumber = (num: string) => {
    if (currentInput === '0' && num !== '.') {
      setCurrentInput(num);
    } else if (currentInput.includes('.') && num === '.') {
      return;
    } else {
      setCurrentInput((prev) => prev + num);
    }
  };

  const appendOperator = (op: string) => {
    if (currentInput !== '0') {
      setPreviousInput(currentInput);
      setOperator(op);
      setCurrentInput('0');
    }
  };

  const calculateResult = () => {
    if (previousInput && operator) {
      let result: number;
      const prev = parseFloat(previousInput);
      const current = parseFloat(currentInput);

      if (isNaN(prev) || isNaN(current)) return;

      if (current === 0 && operator === '/') {
        toast.error("Error", { description: "Division by zero is not allowed." }); // Using toast instead of alert
        setCurrentInput('0');
        setPreviousInput('');
        setOperator(null);
        return;
      }

      switch (operator) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '*':
          result = prev * current;
          break;
        case '/':
          result = prev / current;
          break;
        default:
          return;
      }
      setCurrentInput(result.toString());
      setPreviousInput('');
      setOperator(null);
    }
  };

  const clearCalc = () => {
    setCurrentInput('0');
    setPreviousInput('');
    setOperator(null);
  };

  return (
    <div className="flex flex-col h-full items-center justify-end">
      <div className="w-full bg-[#2d3748] rounded-md p-4 mb-4 text-right overflow-x-auto text-xl font-bold">
        <div className="text-white min-h-[1.5em]">{currentInput}</div>
      </div>
      <div className="grid grid-cols-4 gap-2 w-full">
        <button onClick={clearCalc} className="col-span-2 px-4 py-4 bg-gray-600 rounded-md hover:bg-gray-700">C</button>
        <button onClick={() => appendOperator('/')} className="px-4 py-4 bg-orange-500 rounded-md hover:bg-orange-600">/</button>
        <button onClick={() => appendOperator('*')} className="px-4 py-4 bg-orange-500 rounded-md hover:bg-orange-600">x</button>
        <button onClick={() => appendNumber('7')} className="px-4 py-4 bg-gray-700 rounded-md hover:bg-gray-800">7</button>
        <button onClick={() => appendNumber('8')} className="px-4 py-4 bg-gray-700 rounded-md hover:bg-gray-800">8</button>
        <button onClick={() => appendNumber('9')} className="px-4 py-4 bg-gray-700 rounded-md hover:bg-gray-800">9</button>
        <button onClick={() => appendOperator('-')} className="px-4 py-4 bg-orange-500 rounded-md hover:bg-orange-600">-</button>
        <button onClick={() => appendNumber('4')} className="px-4 py-4 bg-gray-700 rounded-md hover:bg-gray-800">4</button>
        <button onClick={() => appendNumber('5')} className="px-4 py-4 bg-gray-700 rounded-md hover:bg-gray-800">5</button>
        <button onClick={() => appendNumber('6')} className="px-4 py-4 bg-gray-700 rounded-md hover:bg-gray-800">6</button>
        <button onClick={() => appendOperator('+')} className="px-4 py-4 bg-orange-500 rounded-md hover:bg-orange-600">+</button>
        <button onClick={() => appendNumber('1')} className="px-4 py-4 bg-gray-700 rounded-md hover:bg-gray-800">1</button>
        <button onClick={() => appendNumber('2')} className="px-4 py-4 bg-gray-700 rounded-md hover:bg-gray-800">2</button>
        <button onClick={() => appendNumber('3')} className="px-4 py-4 bg-gray-700 rounded-md hover:bg-gray-800">3</button>
        <button onClick={calculateResult} className="px-4 py-4 bg-orange-500 rounded-md hover:bg-orange-600 row-span-2">=</button>
        <button onClick={() => appendNumber('0')} className="col-span-2 px-4 py-4 bg-gray-700 rounded-md hover:bg-gray-800">0</button>
        <button onClick={() => appendNumber('.')} className="px-4 py-4 bg-gray-700 rounded-md hover:bg-gray-800">.</button>
      </div>
    </div>
  );
};

export default CalculatorApp;