import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import { forwardRef } from "react";

export const InputBox = forwardRef(
  (
    {
      logo,
      parameter,
      inputType = "Text",
      options = {},
      placeholder,
      defaultVal,
      onChange,
      disabled = false,
      className = "",
    },
    ref
  ) => {
    return (
      <div className={`flex items-center h-fit ${className}`}>
        {/* <div className="flex items-end h-full">
          <label className="bg-cyan-300 text-black w-[50px] h-[50px] flex justify-center items-center rounded-full">
            <Latex>${logo}$</Latex>
          </label>
        </div> */}

        <div className="flex flex-col justify-center">
          <p className="text-start text-[12px]">{parameter}</p>
          {inputType === "Select" ? (
            <select
              ref={ref}
              className="w-full border border-gray-50 rounded-xl px-4 py-2 mt-2"
              onChange={onChange}
            >
              {options.map((option, index) => (
                <option key={index} value={option} className="text-black">
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              ref={ref}
              type={inputType}
              onChange={onChange}
              placeholder={placeholder}
              defaultValue={defaultVal}
              disabled={disabled}
              className={`w-full border border-gray-50 rounded-xl px-4 py-2 mt-2 ${
                disabled ? "text-gray-400 cursor-not-allowed" : "text-white"
              }`}
            />
          )}
        </div>
      </div>
    );
  }
);
