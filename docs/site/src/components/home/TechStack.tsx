import { useMemo } from 'react';
import { useFadeInUp, useStaggerChildren } from '../../hooks/animations';
import { useAppContext } from '../../store/appStore';

const ReactIcon = () => (
	<svg className="size-6" viewBox="0 0 841.9 595.3" aria-hidden="true">
		<g fill="none" stroke="#61dafb" strokeWidth="40">
			<ellipse cx="420.9" cy="296.5" rx="165" ry="64" />
			<ellipse cx="420.9" cy="296.5" rx="165" ry="64" transform="rotate(60 420.9 296.5)" />
			<ellipse cx="420.9" cy="296.5" rx="165" ry="64" transform="rotate(120 420.9 296.5)" />
		</g>
		<circle cx="420.9" cy="296.5" r="45.7" fill="#61dafb" />
	</svg>
);

const TechStack = () => {
	const { lang } = useAppContext();
	const isZh = lang === 'zh_CN';
	const titleRef = useFadeInUp<HTMLDivElement>({ delay: 0, duration: 800, distance: 30 });
	const reactRef = useFadeInUp<HTMLDivElement>({ delay: 100, duration: 800, distance: 30 });
	const reactGridRef = useStaggerChildren<HTMLDivElement>({ stagger: 80, duration: 500 });
	const tailwindRef = useFadeInUp<HTMLDivElement>({ delay: 200, duration: 800, distance: 30 });
	const tailwindGridRef = useStaggerChildren<HTMLDivElement>({ stagger: 80, duration: 500 });
	const rtdfRef = useFadeInUp<HTMLDivElement>({ delay: 300, duration: 800, distance: 30 });
	const rtdfGridRef = useStaggerChildren<HTMLDivElement>({ stagger: 80, duration: 500 });

	const reactAdvantages = useMemo(
		() => [
			{ value: 'JSX', desc: isZh ? 'JSX 语法直观表达 UI 结构' : 'JSX expresses UI structure directly' },
			{ value: 'Hooks', desc: isZh ? 'Hooks 组合逻辑更灵活' : 'Hooks compose logic flexibly' },
			{ value: isZh ? '生态' : 'Ecosystem', desc: isZh ? '庞大生态与社区支持' : 'Large ecosystem and community' },
			{ value: isZh ? '组合' : 'Compose', desc: isZh ? '组件化复用更轻松' : 'Component reuse by composition' },
			{ value: isZh ? '工具' : 'Tooling', desc: isZh ? '丰富的工程化工具链' : 'Strong tooling and workflows' }
		],
		[isZh]
	);

	const tailwindAdvantages = useMemo(
		() => [
			{ value: isZh ? '原子化' : 'Atomic', desc: isZh ? '实用优先的设计理念，样式即文档' : 'Utility-first design, styles as documentation' },
			{ value: isZh ? '零运行时' : 'Zero RT', desc: isZh ? '构建时生成，无运行时性能损耗' : 'Generated at build time, no runtime cost' },
			{ value: isZh ? '响应式' : 'Responsive', desc: isZh ? '内置响应式断点，轻松适配各种屏幕' : 'Built-in breakpoints for all screen sizes' },
			{ value: isZh ? '可定制' : 'Custom', desc: isZh ? '完整的主题配置系统' : 'Complete theming system' },
			{ value: isZh ? '按需生成' : 'JIT', desc: isZh ? '即时编译，只生成使用到的样式' : 'Just-in-time, only generates used styles' }
		],
		[isZh]
	);

	const rtdfAdvantages = useMemo(
		() => [
			{ value: isZh ? '零依赖' : 'Zero Dep', desc: isZh ? '减少依赖负担与安全风险' : 'Reduce dependency and security risks' },
			{ value: '100% TS', desc: isZh ? '完整类型提示，开发更安心' : 'Complete typings for better DX' },
			{ value: isZh ? '简洁' : 'Clean', desc: isZh ? '代码简洁，易于二次定制' : 'Clean code, easy to customize' },
			{ value: isZh ? '工具链' : 'Toolchain', desc: isZh ? '插件、VS Code 扩展、CLI' : 'Plugins, VS Code extension, CLI' },
			{ value: isZh ? '主题系统' : 'Theming', desc: isZh ? '丰富主题与暗黑模式支持' : 'Rich themes and dark mode support' }
		],
		[isZh]
	);

	return (
		<section className="py-16">
			<div className="mx-auto max-w-6xl px-4">
				<div ref={titleRef} className="mb-12 text-center">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary dark:border-dark/20 dark:bg-dark/5 dark:text-dark">
						<svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M3.33946 17.0002C2.90721 16.2515 2.58277 15.4702 2.36133 14.6741C3.3338 14.1779 3.99972 13.1668 3.99972 12.0002C3.99972 10.8345 3.3348 9.824 2.36353 9.32741C2.81025 7.71651 3.65857 6.21627 4.86474 4.99001C5.7807 5.58416 6.98935 5.65534 7.99972 5.072C9.01009 4.48866 9.55277 3.40635 9.4962 2.31604C11.1613 1.8846 12.8847 1.90004 14.5031 2.31862C14.4475 3.40806 14.9901 4.48912 15.9997 5.072C17.0101 5.65532 18.2187 5.58416 19.1346 4.99007C19.7133 5.57986 20.2277 6.25151 20.66 7.00021C21.0922 7.7489 21.4167 8.53025 21.6381 9.32628C20.6656 9.82247 19.9997 10.8336 19.9997 12.0002C19.9997 13.166 20.6646 14.1764 21.6359 14.673C21.1892 16.2839 20.3409 17.7841 19.1347 19.0104C18.2187 18.4163 17.0101 18.3451 15.9997 18.9284C14.9893 19.5117 14.4467 20.5941 14.5032 21.6844C12.8382 22.1158 11.1148 22.1004 9.49633 21.6818C9.55191 20.5923 9.00929 19.5113 7.99972 18.9284C6.98938 18.3451 5.78079 18.4162 4.86484 19.0103C4.28617 18.4205 3.77172 17.7489 3.33946 17.0002ZM8.99972 17.1964C10.0911 17.8265 10.8749 18.8227 11.2503 19.9659C11.7486 20.0133 12.2502 20.014 12.7486 19.9675C13.1238 18.8237 13.9078 17.8268 14.9997 17.1964C16.0916 16.5659 17.347 16.3855 18.5252 16.6324C18.8146 16.224 19.0648 15.7892 19.2729 15.334C18.4706 14.4373 17.9997 13.2604 17.9997 12.0002C17.9997 10.74 18.4706 9.5632 19.2729 8.6665C19.1688 8.4405 19.0538 8.21822 18.9279 8.00021C18.802 7.78219 18.667 7.57148 18.5233 7.36842C17.3457 7.61476 16.0911 7.43414 14.9997 6.80405C13.9083 6.17395 13.1246 5.17768 12.7491 4.03455C12.2509 3.98714 11.7492 3.98646 11.2509 4.03292C10.8756 5.17671 10.0916 6.17364 8.99972 6.80405C7.9078 7.43447 6.65245 7.61494 5.47428 7.36803C5.18485 7.77641 4.93463 8.21117 4.72656 8.66637C5.52881 9.56311 5.99972 10.74 5.99972 12.0002C5.99972 13.2604 5.52883 14.4372 4.72656 15.3339C4.83067 15.5599 4.94564 15.7822 5.07152 16.0002C5.19739 16.2182 5.3324 16.4289 5.47612 16.632C6.65377 16.3857 7.90838 16.5663 8.99972 17.1964ZM11.9997 15.0002C10.3429 15.0002 8.99972 13.6571 8.99972 12.0002C8.99972 10.3434 10.3429 9.00021 11.9997 9.00021C13.6566 9.00021 14.9997 10.3434 14.9997 12.0002C14.9997 13.6571 13.6566 15.0002 11.9997 15.0002ZM11.9997 13.0002C12.552 13.0002 12.9997 12.5525 12.9997 12.0002C12.9997 11.4479 12.552 11.0002 11.9997 11.0002C11.4474 11.0002 10.9997 11.4479 10.9997 12.0002C10.9997 12.5525 11.4474 13.0002 11.9997 13.0002Z" />
						</svg>
						<span>{isZh ? '技术栈' : 'Tech Stack'}</span>
					</div>

					<h2 className="mb-4 bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-3xl font-bold text-transparent md:text-4xl dark:from-white dark:via-gray-300 dark:to-white">
						{isZh ? '站在巨人肩膀上' : "Standing on Giants' Shoulders"}
					</h2>
					<p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400">
						{isZh ? '基于 React + Tailwind CSS，继承优秀基因' : 'Built on React + Tailwind CSS, inheriting great genes'}
					</p>
				</div>

				<div ref={reactRef} className="mb-12">
					<div className="mb-6 flex items-center gap-3">
						<ReactIcon />
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">React</h3>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							{isZh ? '组件化与生态强大的 UI 库' : 'Component-driven UI library with strong ecosystem'}
						</span>
					</div>
					<div ref={reactGridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
						{reactAdvantages.map((item) => (
							<div key={item.value} className="rounded-xl bg-sky-50/50 p-4 dark:bg-sky-950/20">
								<div className="mb-2 text-2xl font-bold text-sky-600 dark:text-sky-400">{item.value}</div>
								<div className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</div>
							</div>
						))}
					</div>
				</div>

				<div ref={tailwindRef} className="mb-12">
					<div className="mb-6 flex items-center gap-3">
						<svg className="size-8" viewBox="0 0 24 24">
							<path
								fill="#38bdf8"
								d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z"
							/>
						</svg>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Tailwind CSS</h3>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							{isZh ? '实用优先的 CSS 框架' : 'Utility-first CSS Framework'}
						</span>
					</div>
					<div ref={tailwindGridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
						{tailwindAdvantages.map((item) => (
							<div key={item.value} className="rounded-xl bg-sky-50/50 p-4 dark:bg-sky-950/20">
								<div className="mb-2 text-2xl font-bold text-sky-600 dark:text-sky-400">{item.value}</div>
								<div className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</div>
							</div>
						))}
					</div>
				</div>

				<div ref={rtdfRef} className="mb-12">
					<div className="mb-6 flex items-center gap-3">
						<svg className="size-6" viewBox="0 0 80 80" fill="none">
							<path
								d="M40 0C54.8054 0 67.7312 8.04427 74.6475 20H30V30H40C45.5228 30 50 34.4772 50 40C50 45.5228 45.5228 50 40 50H30V80H10V20H0V0H40ZM78.7393 30C79.5619 33.1962 80 36.547 80 40C80 62.0914 62.0914 80 40 80V60C51.0457 60 60 51.0457 60 40C60 36.3571 59.0259 32.9417 57.3242 30H78.7393Z"
								className="fill-primary dark:fill-dark"
							/>
							<path d="M20 30H40L20 80V50H0L20 0V30Z" className="fill-dark dark:fill-primary" />
						</svg>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
							{isZh ? 'RTDF 独特优势' : 'RTDF Unique Advantages'}
						</h3>
					</div>
					<div ref={rtdfGridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
						{rtdfAdvantages.map((item) => (
							<div key={item.value} className="rounded-xl bg-white/50 p-4 dark:bg-gray-800/50">
								<div className="mb-2 text-2xl font-bold text-primary dark:text-dark">{item.value}</div>
								<div className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default TechStack;
