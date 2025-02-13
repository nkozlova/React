import './Slider.css';
import { useState, useEffect } from 'react';

function Pagination({ activeSlide, count, onSlide }) {
    let pags = [];

    for (let i = 0; i < count; i++) {
        pags.push(
            <button
                className={i === activeSlide ? "pagination-active" : "pagination"}
                onClick={() => onSlide(i)}
                key={i}
            />
        );
    }

    return (
        <div className="overlay">
            {pags}
        </div>
    );
}

function Slider({ slides, loop, navs, pags, auto, stopMouseHover, delay }) {
    const [slideIndex, setSlideIndex] = useState(0);

    function handlePrevBtn() {
        let prevIndex = slideIndex - 1;
        if (prevIndex < 0 && !loop) {
            return;
        }
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }

        setSlideIndex(prevIndex);
    }
    function handleNextBtn() {
        let nextIndex = slideIndex + 1;
        if (nextIndex >= slides.length && !loop) {
            return;
        }
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }

        setSlideIndex(nextIndex);
    }

    // Timer
    const [isPaused, setIsPaused] = useState(false); // Состояние для отслеживания паузы
    useEffect(() => {
        if (!auto || isPaused) {
            return;
        }

        const interval = setInterval(() => {
            setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length); // Устанавливаем интервал, он будет циклично переключать картинки установленное время
        }, delay == null ? 5000 : delay * 1000);

        // Очищаем интервал при размонтировании компонента
        return () => clearInterval(interval);
    }, [isPaused]); // Перезапускаем эффект, когда меняется isPaused

    return (
        <div className="whole-window">
            <div className="page-number">
                {slideIndex + 1} / { slides.length }
            </div>

            <img
                src={slides[slideIndex].img}
                alt={slides[slideIndex].text}
                onMouseEnter={() => setIsPaused(true)} // отслеживаем события мыши
                onMouseLeave={() => setIsPaused(false)}
            />
            <div className="overlay">
                {slides[slideIndex].text}
            </div>

            {navs && (
                <div>
                    <button
                        className="prev-next"
                        onClick={handlePrevBtn}
                        disabled={slideIndex === 0 && !loop}
                    >
                        {'<'}
                    </button>
                    <button
                        className="prev-next"
                        style={{ right: 0 }}
                        onClick={handleNextBtn}
                        disabled={slideIndex === slides.length - 1 && !loop}
                    >
                        {'>'}
                    </button>
                </div>
            )}

            {pags && (
                <Pagination
                    activeSlide={slideIndex}
                    count={slides.length}
                    onSlide={(i) => setSlideIndex(i)}
                />
             )}
        </div>
    );
}

export default function App() {
    const slides = [
        {
            img: 'https://www.w3schools.com/howto/img_nature_wide.jpg',
            text: 'Caption Text 1'
        },
        {
            img: 'https://www.w3schools.com/howto/img_snow_wide.jpg',
            text: 'Caption Text 2'
        },
        {
            img: 'https://www.w3schools.com/howto/img_mountains_wide.jpg',
            text: 'Caption Text 3'
        },
    ];

    return (
        <Slider
            slides={slides}
            loop={true}
            navs={true}
            pags={true}
            auto={true}
            stopMouseHover={true}
            delay={3}
        />
    )
}

