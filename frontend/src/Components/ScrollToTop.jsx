import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // If there's no hash (anchor like #services), scroll to top
        if (!hash) {
            window.scrollTo(0, 0);
        } else {
            // If there is a hash, give it a tiny delay to ensure the content is rendered
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
