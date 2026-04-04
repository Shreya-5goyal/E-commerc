import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
    {
        id: 1,
        title: "Summer Collection 2026",
        desc: "Discover the latest trends in fashion with up to 40% discount on all premium brands.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
        link: "/search?keyword=fashion",
        color: "#1d4ed8"
    },
    {
        id: 2,
        title: "Level Up Your Setup",
        desc: "Next-gen electronics and peripherals. Performance meets premium design.",
        image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&w=1600&q=80",
        link: "/search?keyword=electronics",
        color: "#f59e0b"
    },
    {
        id: 3,
        title: "Premium Home Decor",
        desc: "Transform your living space with our exclusive curated furniture and accessories.",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80",
        link: "/search?keyword=home",
        color: "#059669"
    }
];

const Carousel = () => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((current + 1) % SLIDES.length);
    const prev = () => setCurrent((current - 1 + SLIDES.length) % SLIDES.length);

    return (
        <div className="carousel-container">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="carousel-slide"
                    style={{ backgroundImage: `url(${SLIDES[current].image})` }}
                >
                    <div className="carousel-content">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {SLIDES[current].title}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {SLIDES[current].desc}
                        </motion.p>
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="btn btn-primary"
                            onClick={() => navigate(SLIDES[current].link)}
                            style={{ padding: '14px 40px', fontSize: '1rem' }}
                        >
                            Explore Now <ArrowRight size={18} style={{ marginLeft: 8 }} />
                        </motion.button>
                    </div>
                </motion.div>
            </AnimatePresence>

            <button className="carousel-btn prev" onClick={prev}><ChevronLeft /></button>
            <button className="carousel-btn next" onClick={next}><ChevronRight /></button>

            <div className="carousel-nav">
                {SLIDES.map((_, i) => (
                    <div
                        key={i}
                        className={`carousel-dot ${current === i ? 'active' : ''}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
