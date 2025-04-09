import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import { forwardRef } from "react";

export const InputBox = forwardRef(
    (
        { logo, parameter, inputType = "Text", options = {}, placeholder },
        ref
    ) => {
        return (
            <div className="flex items-center mt-7">
                <div className="flex items-end h-full">
                    <label className="bg-cyan-300 text-black w-[50px] h-[50px] flex justify-center items-center rounded-full">
                        <Latex>${logo}$</Latex>
                    </label>
                </div>

                <div className="ml-5 flex flex-col items-start w-full">
                    <p>{parameter}</p>
                    {inputType === "Select" ? (
                        <select
                            ref={ref}
                            className="w-full border border-gray-50 rounded-xl px-4 py-2 mt-2"
                        >
                            {options.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            ref={ref}
                            type={inputType}
                            placeholder={placeholder}
                            className="w-full border border-gray-50 rounded-xl px-4 py-2 mt-2"
                        />
                    )}
                </div>
            </div>
        );
    }
);
