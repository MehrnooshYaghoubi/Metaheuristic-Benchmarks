export default function InputBox({ logo, parameter }) {
    return (
        <div className="flex items-center mt-7">
            <div className="flex items-end h-full">
                <label className="bg-cyan-300 text-black ml-3 py-3 px-5 rounded-full">
                    {logo}
                </label>
            </div>

            <div className="ml-5 flex flex-col items-start w-full">
                <p>{parameter}</p>
                <input
                    type="text"
                    placeholder="Type something..."
                    className="w-full border border-gray-50 rounded-xl px-4 py-2 mt-2"
                />
            </div>
        </div>
    );
}
