/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";

function RangeSlider({
  initialMin,
  initialMax,
  min,
  max,
  step,
  priceCap,
}: {
  initialMin: number;
  initialMax: number;
  min: number;
  max: number;
  step: number;
  priceCap: number;
}) {
  const progressRef = useRef<any>(null);
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  const handleMin = (e: { target: { value: string } }) => {
    if (maxValue - minValue >= priceCap && maxValue <= max) {
      if (parseInt(e.target.value, 10) > parseInt(maxValue.toString(), 10)) {
        console.log("ss");
      } else {
        setMinValue(parseInt(e.target.value, 10));
      }
    } else if (parseInt(e.target.value, 10) < minValue) {
      setMinValue(parseInt(e.target.value, 10));
    }
  };

  const handleMax = (e: { target: { value: string } }) => {
    if (maxValue - minValue >= priceCap && maxValue <= max) {
      if (parseInt(e.target.value, 10) < parseInt(minValue.toString(), 10)) {
        console.log("ss");
      } else {
        setMaxValue(parseInt(e.target.value, 10));
      }
    } else if (parseInt(e.target.value, 10) > maxValue) {
      setMaxValue(parseInt(e.target.value, 10));
    }
  };

  useEffect(() => {
    if (progressRef && progressRef.current) {
      progressRef.current.style.left = `${(minValue / max) * step}%`;
      progressRef.current.style.right = `${step - (maxValue / max) * step}%`;
    }
  }, [minValue, maxValue, max, step]);

  return (
    <div className="place-items-center">
      <div className="flex flex-col w-96 bg-white rounded-lg px-6">
        <div className="flex justify-between items-center mb-6 ">
          <div className="rounded-md">
            <span className="p-2 font-semibold text-gray-600"> Min</span>
            <input
              onChange={(e) => setMinValue(parseInt(e.target.value, 10))}
              type="number"
              value={minValue}
              className="w-24 rounded-md border border-gray-400 "
            />
          </div>
          <div className="ml-2 font-semibold text-lg"> - </div>
          <div className=" ">
            <span className="p-2 font-semibold text-gray-600"> Max</span>
            <input
              onChange={(e) => setMaxValue(parseInt(e.target.value, 10))}
              type="number"
              value={maxValue}
              className="w-24 rounded-md border border-gray-400"
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="slider relative h-1 rounded-md bg-gray-300">
            <div
              className="progress absolute h-1 bg-green-300 rounded "
              ref={progressRef}
            />
          </div>

          <div className="range-input relative  ">
            <input
              onChange={handleMin}
              type="range"
              min={min}
              step={step}
              max={max}
              value={minValue}
              className="range-min absolute w-full  -top-1  h-1   bg-transparent  appearance-none pointer-events-none"
            />

            <input
              onChange={handleMax}
              type="range"
              min={min}
              step={step}
              max={max}
              value={maxValue}
              className="range-max absolute w-full  -top-1 h-1  bg-transparent appearance-none  pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RangeSlider;
