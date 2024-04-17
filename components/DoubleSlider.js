import React, { useEffect, useRef, useState } from 'react';

const DoubleSlider = () => {
  const [sliderOneValue, setSliderOneValue] = useState(30);
  const [sliderTwoValue, setSliderTwoValue] = useState(70);
  const [sliderMaxValue] = useState(100);
  const [minGap] = useState(0);
  const sliderOneRef = useRef(null);
  const sliderTwoRef = useRef(null);
  const displayValOneRef = useRef(null);
  const displayValTwoRef = useRef(null);
  const sliderTrackRef = useRef(null);

  useEffect(() => {
    slideOne();
    slideTwo();
    fillColor();
  }, []);

  const slideOne = () => {
    const value = parseInt(sliderOneRef.current.value);
    if (value > sliderTwoValue - minGap) {
      setSliderOneValue(sliderTwoValue - minGap);
    } else {
      setSliderOneValue(value);
    }
  }

  const slideTwo = () => {
    const value = parseInt(sliderTwoRef.current.value);
    if (value < sliderOneValue + minGap) {
      setSliderTwoValue(sliderOneValue + minGap);
    } else {
      setSliderTwoValue(value);
    }
  }

  const fillColor = () => {
    const percent1 = (sliderOneValue / sliderMaxValue) * 100;
    const percent2 = (sliderTwoValue / sliderMaxValue) * 100;
    sliderTrackRef.current.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
  }

  useEffect(() => {
    fillColor()
  },[sliderOneValue, sliderTwoValue])

  return (
    <div className="slider_wrapper">
      {/* <div className="values">
        <span ref={displayValOneRef}>
          {sliderOneValue}
        </span>
        <span> &dash; </span>
        <span ref={displayValTwoRef}>
          {sliderTwoValue}
        </span>
      </div> */}
      <div className="slider_container">
        <div className="slider-track" ref={sliderTrackRef}></div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderOneValue}
          ref={sliderOneRef}
          onChange={slideOne}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={sliderTwoValue}
          ref={sliderTwoRef}
          onChange={slideTwo}
        />
      </div>
    </div>
  );
}

export default DoubleSlider;
