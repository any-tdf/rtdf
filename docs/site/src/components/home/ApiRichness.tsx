import { useEffect, useMemo, useRef, useState } from 'react';
import { useFadeInUp, useStaggerChildren } from '../../hooks/animations';
import { useAppContext } from '../../store/appStore';

const ApiRichness = () => {
	const { lang } = useAppContext();
	const isZh = lang === 'zh_CN';
	const titleRef = useFadeInUp<HTMLDivElement>({ delay: 0, duration: 800, distance: 30 });
	const statsRef = useStaggerChildren<HTMLDivElement>({ stagger: 100, duration: 600 });
	const featuresRef = useStaggerChildren<HTMLDivElement>({ stagger: 100, duration: 600 });
	const counterRef = useRef<HTMLDivElement | null>(null);
	const animationFrameId = useRef<number | null>(null);

	const stats = useMemo(
		() => [
			{
				value: 900,
				suffix: '+',
				label: isZh ? 'Props 配置' : 'Props Options',
				desc: isZh ? '深度可定制化' : 'Deeply customizable',
				icon: 'M3.34 17a10.018 10.018 0 0 1-.978-2.326 3 3 0 0 0 .002-5.347A9.99 9.99 0 0 1 4.865 4.99a3 3 0 0 0 4.631-2.674 9.99 9.99 0 0 1 5.007.002 3 3 0 0 0 4.632 2.672 10.018 10.018 0 0 1 2.525 4.337 3 3 0 0 0-.002 5.347 9.99 9.99 0 0 1-2.525 4.337 3 3 0 0 0-4.63 2.674 9.99 9.99 0 0 1-5.008-.002 3 3 0 0 0-4.631-2.672A10.018 10.018 0 0 1 3.34 17zm5.66.196a4.993 4.993 0 0 1 2.25 2.77c.499.047 1 .048 1.499.001a4.993 4.993 0 0 1 2.25-2.77 4.993 4.993 0 0 1 3.525-.564c.29-.408.54-.843.748-1.298A4.993 4.993 0 0 1 18 12c0-1.26.47-2.437 1.273-3.334a8.126 8.126 0 0 0-.75-1.298A4.993 4.993 0 0 1 15 6.804a4.993 4.993 0 0 1-2.25-2.77 8.126 8.126 0 0 0-1.5-.001A4.993 4.993 0 0 1 9 6.804a4.993 4.993 0 0 1-3.525.565 7.99 7.99 0 0 0-.748 1.298A4.993 4.993 0 0 1 6 12c0 1.26-.47 2.437-1.273 3.334.207.455.456.89.749 1.298A4.993 4.993 0 0 1 9 17.196zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
				color: 'from-violet-500 to-purple-600'
			},
			{
				value: 150,
				suffix: '+',
				label: isZh ? '事件 & 方法' : 'Events & Methods',
				desc: isZh ? '灵活交互控制' : 'Flexible interaction control',
				icon: 'M4 3C3.44772 3 3 3.44772 3 4V10C3 10.5523 3.44772 11 4 11H10C10.5523 11 11 10.5523 11 10V4C11 3.44772 10.5523 3 10 3H4ZM4 13C3.44772 13 3 13.4477 3 14V20C3 20.5523 3.44772 21 4 21H10C10.5523 21 11 20.5523 11 20V14C11 13.4477 10.5523 13 10 13H4ZM14 13C13.4477 13 13 13.4477 13 14V20C13 20.5523 13.4477 21 14 21H20C20.5523 21 21 20.5523 21 20V14C21 13.4477 20.5523 13 20 13H14ZM15 19V15H19V19H15ZM5 9V5H9V9H5ZM5 19V15H9V19H5ZM16 11V8H13V6H16V3H18V6H21V8H18V11H16Z',
				color: 'from-amber-500 to-orange-600'
			},
			{
				value: 70,
				suffix: '+',
				label: isZh ? 'ReactNode / 渲染函数' : 'ReactNode / Render Props',
				desc: isZh ? '组件内容可组合' : 'Composable content areas',
				icon: 'M22 9.999V20a1 1 0 0 1-1 1h-8V9.999h9zm-11 6V21H3a1 1 0 0 1-1-1v-4.001h9zM11 3v10.999H2V4a1 1 0 0 1 1-1h8zm10 0a1 1 0 0 1 1 1v3.999h-9V3h8z',
				color: 'from-emerald-500 to-teal-600'
			},
			{
				value: 60,
				suffix: '+',
				label: isZh ? '可注入样式' : 'Injectable CSS',
				desc: isZh ? '扩展自定义样式' : 'Extend custom styles',
				icon: 'M5.7646 7.99998L5.46944 7.26944C5.26255 6.75737 5.50995 6.17454 6.02202 5.96765L15.2939 2.22158C15.8059 2.01469 16.3888 2.26209 16.5956 2.77416L22.2147 16.6819C22.4216 17.194 22.1742 17.7768 21.6622 17.9837L12.3903 21.7298C11.8783 21.9367 11.2954 21.6893 11.0885 21.1772L11.0002 20.9586V21H7.00021C6.44792 21 6.00021 20.5523 6.00021 20V19.7303L2.65056 18.377C2.13849 18.1701 1.89109 17.5873 2.09798 17.0752L5.7646 7.99998ZM8.00021 19H10.2089L8.00021 13.5333V19ZM6.00021 12.7558L4.32696 16.8972L6.00021 17.6084V12.7558ZM7.69842 7.44741L12.5683 19.5008L19.9858 16.5039L15.1159 4.45055L7.69842 7.44741ZM10.6766 9.47974C10.1645 9.68663 9.5817 9.43924 9.37481 8.92717C9.16792 8.4151 9.41532 7.83227 9.92739 7.62538C10.4395 7.41849 11.0223 7.66588 11.2292 8.17795C11.4361 8.69002 11.1887 9.27286 10.6766 9.47974Z',
				color: 'from-rose-500 to-pink-600'
			}
		],
		[isZh]
	);

	const features = useMemo(
		() => [
			{
				icon: 'M6.17 18a3.001 3.001 0 0 1 5.66 0H22v2H11.83a3.001 3.001 0 0 1-5.66 0H2v-2h4.17zm6-7a3.001 3.001 0 0 1 5.66 0H22v2h-4.17a3.001 3.001 0 0 1-5.66 0H2v-2h10.17zm-6-7a3.001 3.001 0 0 1 5.66 0H22v2H11.83a3.001 3.001 0 0 1-5.66 0H2V4h4.17zM9 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
				title: isZh ? '深度可配置' : 'Deeply Configurable',
				desc: isZh ? '每个组件提供丰富的 Props 选项' : 'Each component offers rich props options'
			},
			{
				icon: 'M19 22H5a3 3 0 0 1-3-3V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v12h4v4a3 3 0 0 1-3 3zm-1-5v2a1 1 0 0 0 2 0v-2h-2zm-2 3V4H4v15a1 1 0 0 0 1 1h11zM6 7h8v2H6V7zm0 4h8v2H6v-2zm0 4h5v2H6v-2z',
				title: isZh ? '统一 API 设计' : 'Unified API Design',
				desc: isZh ? '组件间 API 风格一致，易于学习' : 'Consistent API style across components'
			},
			{
				icon: 'M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm16 7l-3.536 3.536-1.414-1.415L17.172 12l-2.122-2.121 1.414-1.415L20 12zM6.828 12l2.122 2.121-1.414 1.415L4 12l3.536-3.536L8.95 9.88 6.828 12zm4.416 5H9.116l3.64-10h2.128l-3.64 10z',
				title: isZh ? '丰富示例' : 'Rich Examples',
				desc: isZh ? '每个 API 都有对应示例' : 'Examples for every API'
			},
			{
				icon: 'M21 18H6C5.44772 18 5 18.4477 5 19C5 19.5523 5.44772 20 6 20H21V22H6C4.34315 22 3 20.6569 3 19V4C3 2.89543 3.89543 2 5 2H21V18ZM5 16.05C5.16156 16.0172 5.32877 16 5.5 16H19V4H5V16.05ZM16 9H8V7H16V9Z',
				title: isZh ? '详尽文档' : 'Detailed Documentation',
				desc: isZh ? '中英双语，注释清晰' : 'Bilingual with clear comments'
			}
		],
		[isZh]
	);

	const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));

	useEffect(() => {
		const node = counterRef.current;
		if (!node) return;
		let hasAnimated = false;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting || hasAnimated) return;
					hasAnimated = true;
					const duration = 1500;
					const startTime = performance.now();

					const update = () => {
						const elapsed = performance.now() - startTime;
						const progress = Math.min(elapsed / duration, 1);
						const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
						setAnimatedValues(stats.map((stat) => Math.floor(eased * stat.value)));

						if (progress < 1) {
							animationFrameId.current = requestAnimationFrame(update);
						} else {
							setAnimatedValues(stats.map((stat) => stat.value));
							animationFrameId.current = null;
						}
					};

					animationFrameId.current = requestAnimationFrame(update);
					observer.disconnect();
				});
			},
			{ threshold: 0.3 }
		);

		observer.observe(node);
		return () => {
			observer.disconnect();
			if (animationFrameId.current !== null) {
				cancelAnimationFrame(animationFrameId.current);
				animationFrameId.current = null;
			}
		};
	}, [stats]);

	return (
		<section className="pb-20 pt-36 md:pb-32 md:pt-48">
			<div className="mx-auto max-w-6xl px-4">
				<div ref={titleRef} className="mb-16 text-center">
					<h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
						{isZh ? '丰富的 API，极致的可控性' : 'Rich APIs, Ultimate Controllability'}
					</h2>
					<p className="mx-auto max-w-2xl text-base opacity-70">
						{isZh ? '可能是移动 Web 组件库中 API 最丰富的' : 'Perhaps the richest API in mobile web component libraries'}
					</p>
				</div>

				<div ref={counterRef} className="mb-16">
					<div ref={statsRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
						{stats.map((stat, index) => (
							<div key={stat.label} className="rounded-2xl bg-white/50 p-6 text-center backdrop-blur-sm dark:bg-gray-800/50">
								<div className={`mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-linear-to-br ${stat.color}`}>
									<svg className="size-6 text-white" viewBox="0 0 24 24" fill="currentColor">
										<path d={stat.icon} />
									</svg>
								</div>
								<div className="mb-2 text-3xl font-bold text-primary dark:text-dark md:text-4xl">
									{animatedValues[index]}
									{stat.suffix}
								</div>
								<div className="mb-1 text-base font-medium text-gray-900 dark:text-gray-100">{stat.label}</div>
								<div className="text-xs opacity-60">{stat.desc}</div>
							</div>
						))}
					</div>
				</div>

				<div ref={featuresRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{features.map((feature) => (
						<div key={feature.title} className="flex gap-4 rounded-2xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-800/50">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-dark/10">
								<svg className="size-5 text-primary dark:text-dark" viewBox="0 0 24 24" fill="currentColor">
									<path d={feature.icon} />
								</svg>
							</div>
							<div>
								<h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h3>
								<p className="text-xs opacity-60">{feature.desc}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default ApiRichness;
