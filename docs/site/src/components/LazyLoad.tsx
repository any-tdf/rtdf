import { useEffect, useRef, useState, type ReactNode } from 'react';

type LazyLoadProps = {
	height?: string;
	children: ReactNode;
};

const LazyLoad = ({ height = '400px', children }: LazyLoadProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const node = containerRef.current;
		if (!node) return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					setIsVisible(true);
					observer.disconnect();
				});
			},
			{ threshold: 0.1 }
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={containerRef} style={{ minHeight: height }}>
			{isVisible ? children : null}
		</div>
	);
};

export default LazyLoad;
