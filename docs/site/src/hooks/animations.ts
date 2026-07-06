import { useEffect, useRef } from 'react';

export type FadeInUpOptions = {
	delay?: number;
	duration?: number;
	distance?: number;
	threshold?: number;
};

export type StaggerChildrenOptions = {
	selector?: string;
	stagger?: number;
	duration?: number;
	threshold?: number;
};

export const useFadeInUp = <T extends HTMLElement>(options: FadeInUpOptions = {}) => {
	const { delay = 0, duration = 1000, distance = 200, threshold = 0.1 } = options;
	const ref = useRef<T | null>(null);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		node.style.opacity = '0';
		node.style.transform = `translateY(${distance}px)`;
		node.style.transitionProperty = 'opacity, transform';
		node.style.transitionDuration = `${duration}ms`;
		node.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					setTimeout(() => {
						node.style.opacity = '1';
						node.style.transform = 'translateY(0)';
					}, delay);
					setTimeout(() => {
						node.style.transitionDuration = '300ms';
					}, delay + duration);
					observer.disconnect();
				});
			},
			{ threshold }
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [delay, distance, duration, threshold]);

	return ref;
};

export const useStaggerChildren = <T extends HTMLElement>(options: StaggerChildrenOptions = {}) => {
	const { selector = ':scope > *', stagger = 100, duration = 800, threshold = 0.1 } = options;
	const ref = useRef<T | null>(null);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		const children = node.querySelectorAll<HTMLElement>(selector);

		children.forEach((child) => {
			child.style.opacity = '0';
			child.style.transform = 'translateY(30px)';
			child.style.transitionProperty = 'opacity, transform';
			child.style.transitionDuration = `${duration}ms`;
			child.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
		});

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					children.forEach((child, index) => {
						setTimeout(() => {
							child.style.opacity = '1';
							child.style.transform = 'translateY(0)';
						}, index * stagger);
					});
					observer.disconnect();
				});
			},
			{ threshold }
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [duration, selector, stagger, threshold]);

	return ref;
};
