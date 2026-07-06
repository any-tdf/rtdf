import { useMemo, useState } from 'react';
import { Button } from 'rtdf/components';
import { useAppContext } from '../../store/appStore';

const ApiPlayground = () => {
	const { lang } = useAppContext();
	const isZh = lang === 'zh_CN';

	const [fill, setFill] = useState<'base' | 'line' | 'lineLight' | 'lineState' | 'text' | 'textState' | 'colorLight'>('base');
	const [buttonState, setButtonState] = useState<'theme' | 'success' | 'warning' | 'error' | 'info'>('theme');
	const [radius, setRadius] = useState<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'>('md');
	const [size, setSize] = useState<'full' | 'big' | 'md' | 'sm' | 'auto'>('big');
	const [border, setBorder] = useState<'solid' | 'dashed' | 'dotted'>('solid');
	const [love, setLove] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [showIcon, setShowIcon] = useState(false);
	const [iconPosition, setIconPosition] = useState<'left' | 'right'>('left');
	const [showLoading, setShowLoading] = useState(false);

	const fillOptions = useMemo(
		() => [
			{ value: 'base', label: isZh ? '实心' : 'Base' },
			{ value: 'line', label: isZh ? '线框' : 'Line' },
			{ value: 'lineLight', label: isZh ? '浅线框' : 'LineLight' },
			{ value: 'lineState', label: isZh ? '状态线框' : 'LineState' },
			{ value: 'text', label: isZh ? '文字' : 'Text' },
			{ value: 'textState', label: isZh ? '状态文字' : 'TextState' },
			{ value: 'colorLight', label: isZh ? '浅色底' : 'ColorLight' }
		],
		[isZh]
	);

	const stateOptions = useMemo(
		() => [
			{ value: 'theme', label: isZh ? '主题色' : 'Theme', color: 'bg-primary dark:bg-dark' },
			{ value: 'success', label: isZh ? '成功' : 'Success', color: 'bg-success' },
			{ value: 'warning', label: isZh ? '警告' : 'Warning', color: 'bg-warning' },
			{ value: 'error', label: isZh ? '错误' : 'Error', color: 'bg-error' },
			{ value: 'info', label: isZh ? '信息' : 'Info', color: 'bg-info' }
		],
		[isZh]
	);

	const radiusOptions = useMemo(
		() => [
			{ value: 'none', label: 'none' },
			{ value: 'xs', label: 'xs' },
			{ value: 'sm', label: 'sm' },
			{ value: 'md', label: 'md' },
			{ value: 'lg', label: 'lg' },
			{ value: 'xl', label: 'xl' },
			{ value: '2xl', label: '2xl' },
			{ value: 'full', label: 'full' }
		],
		[]
	);

	const sizeOptions = useMemo(
		() => [
			{ value: 'auto', label: 'auto' },
			{ value: 'sm', label: 'sm' },
			{ value: 'md', label: 'md' },
			{ value: 'big', label: 'big' },
			{ value: 'full', label: 'full' }
		],
		[]
	);

	const borderOptions = useMemo(
		() => [
			{ value: 'solid', label: isZh ? '实线' : 'Solid' },
			{ value: 'dashed', label: isZh ? '虚线' : 'Dashed' },
			{ value: 'dotted', label: isZh ? '点线' : 'Dotted' }
		],
		[isZh]
	);

	const isLineFill = fill === 'line' || fill === 'lineLight' || fill === 'lineState';

	const codePreview = useMemo(() => {
		const tagColor = 'text-rose-500 dark:text-rose-400';
		const propNameColor = 'text-violet-600 dark:text-violet-400';
		const propValueColor = 'text-emerald-600 dark:text-emerald-400';
		const braceColor = 'text-amber-600 dark:text-amber-400';
		const textColor = 'text-gray-700 dark:text-gray-300';

		const buttonText = isZh ? '按钮' : 'Button';

		const formatProp = (name: string, value: string, isObject = false) => {
			if (isObject) {
				return `<span class="${propNameColor}">${name}</span>=<span class="${braceColor}">${value}</span>`;
			}
			return `<span class="${propNameColor}">${name}</span>=<span class="${propValueColor}">"${value}"</span>`;
		};

		const formatBoolProp = (name: string) => `<span class="${propNameColor}">${name}</span>`;

		const props: string[] = [];
		if (fill !== 'base') props.push(formatProp('fill', fill));
		if (buttonState !== 'theme') props.push(formatProp('state', buttonState));
		if (radius !== 'md') props.push(formatProp('radius', radius));
		if (size !== 'big') props.push(formatProp('size', size));
		if (isLineFill && border !== 'solid') props.push(formatProp('border', border));
		if (love) props.push(formatBoolProp('love'));
		if (disabled) props.push(formatBoolProp('disabled'));
		if (showIcon) props.push(formatProp('icon', "{{ name: 'ri-heart-line' }}", true));
		if (showIcon && iconPosition !== 'left') props.push(formatProp('iconPosition', iconPosition));
		if (showLoading) props.push(formatProp('loading', '{{ type: "1_0" }}', true));

		if (props.length === 0) {
			return `<span class="${tagColor}">&lt;Button&gt;</span><span class="${textColor}">${buttonText}</span><span class="${tagColor}">&lt;/Button&gt;</span>`;
		}
		const propsStr = props.map((p) => `  ${p}`).join('\n');
		return `<span class="${tagColor}">&lt;Button</span>\n${propsStr}\n<span class="${tagColor}">&gt;</span>\n  <span class="${textColor}">${buttonText}</span>\n<span class="${tagColor}">&lt;/Button&gt;</span>`;
	}, [border, buttonState, fill, iconPosition, isLineFill, isZh, love, radius, showIcon, showLoading, size, disabled]);

	return (
		<section className="relative overflow-hidden py-20 md:py-32">
			<div className="relative z-10 mx-auto max-w-6xl px-4">
				<div className="mb-12 text-center">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary dark:border-dark/20 dark:bg-dark/5 dark:text-dark">
						<svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
							<path d="M24 12L18.3431 17.6569L16.9289 16.2426L21.1716 12L16.9289 7.75736L18.3431 6.34315L24 12ZM2.82843 12L7.07107 16.2426L5.65685 17.6569L0 12L5.65685 6.34315L7.07107 7.75736L2.82843 12ZM9.78845 21H7.66009L14.2116 3H16.3399L9.78845 21Z" />
						</svg>
						<span>{isZh ? '灵活 API' : 'Flexible API'}</span>
					</div>

					<h2 className="mb-4 bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-3xl font-bold text-transparent md:text-4xl dark:from-white dark:via-gray-300 dark:to-white">
						{isZh ? '千变万化，随心定制' : 'Infinite Possibilities'}
					</h2>
					<p className="mx-auto max-w-2xl text-base opacity-70">{isZh ? '一个组件，无限可能' : 'One component, infinite possibilities'}</p>
				</div>

				<div>
					<div className="site-api-playground-grid grid gap-6">
						<div className="rounded-2xl border border-gray-200/50 bg-white/70 px-3 py-5 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-gray-900/70">
							<div className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{isZh ? '属性配置' : 'Props Configuration'}</div>

							<div className="mb-4">
								<div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
									fill <span className="text-primary dark:text-dark">({isZh ? '填充样式' : 'fill style'})</span>
								</div>
								<div className="flex flex-wrap gap-1.5">
									{fillOptions.map((option) => (
										<button
											key={option.value}
											type="button"
											className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
												fill === option.value
													? 'bg-primary text-white dark:bg-dark dark:text-black'
													: 'bg-gray-100 text-gray-600 active:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:active:bg-gray-700'
											}`}
											onClick={() => setFill(option.value)}
										>
											{option.label}
										</button>
									))}
								</div>
							</div>

							<div className="mb-4">
								<div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
									state <span className="text-primary dark:text-dark">({isZh ? '状态颜色' : 'state color'})</span>
								</div>
								<div className="flex flex-wrap gap-1.5">
									{stateOptions.map((option) => (
										<button
											key={option.value}
											type="button"
											className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
												buttonState === option.value
													? 'bg-primary text-white dark:bg-dark dark:text-black'
													: 'bg-gray-100 text-gray-600 active:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:active:bg-gray-700'
											}`}
											onClick={() => setButtonState(option.value)}
										>
											<span className={`size-2 rounded-full ${option.color}`}></span>
											{option.label}
										</button>
									))}
								</div>
							</div>

							<div className="mb-4">
								<div className="mb-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
									<span>
										radius <span className="text-primary dark:text-dark">({isZh ? '圆角' : 'border radius'})</span>
									</span>
									<span className="relative">
										<button type="button" className="peer cursor-help">
											<svg className="size-3.5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="currentColor">
												<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z" />
											</svg>
										</button>
										<span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg peer-hover:block peer-focus:block dark:bg-gray-700">
											{isZh ? '默认继承主题圆角，支持自定义覆盖' : 'Inherits theme radius by default, supports custom override'}
											<span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-gray-700"></span>
										</span>
									</span>
								</div>
								<div className="flex flex-wrap gap-1.5">
									{radiusOptions.map((option) => (
										<button
											key={option.value}
											type="button"
											className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
												radius === option.value
													? 'bg-primary text-white dark:bg-dark dark:text-black'
													: 'bg-gray-100 text-gray-600 active:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:active:bg-gray-700'
											}`}
											onClick={() => setRadius(option.value)}
										>
											{option.label}
										</button>
									))}
								</div>
							</div>

							<div className="mb-4">
								<div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
									size <span className="text-primary dark:text-dark">({isZh ? '尺寸' : 'size'})</span>
								</div>
								<div className="flex flex-wrap gap-1.5">
									{sizeOptions.map((option) => (
										<button
											key={option.value}
											type="button"
											className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
												size === option.value
													? 'bg-primary text-white dark:bg-dark dark:text-black'
													: 'bg-gray-100 text-gray-600 active:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:active:bg-gray-700'
											}`}
											onClick={() => setSize(option.value)}
										>
											{option.label}
										</button>
									))}
								</div>
							</div>

							{isLineFill ? (
								<div className="mb-4">
									<div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
										border <span className="text-primary dark:text-dark">({isZh ? '边框样式' : 'border style'})</span>
									</div>
									<div className="flex flex-wrap gap-1.5">
										{borderOptions.map((option) => (
											<button
												key={option.value}
												type="button"
												className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
													border === option.value
														? 'bg-primary text-white dark:bg-dark dark:text-black'
														: 'bg-gray-100 text-gray-600 active:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:active:bg-gray-700'
												}`}
												onClick={() => setBorder(option.value)}
											>
												{option.label}
											</button>
										))}
									</div>
								</div>
							) : null}

							<div className="mb-4">
								<div className="mb-2 text-xs text-gray-500 dark:text-gray-400">{isZh ? '其他' : 'Others'}</div>
								<div className="flex flex-wrap gap-1.5">
									<button
										type="button"
										className={`rounded-md px-2 py-0.5 text-xs transition-colors ${
											love
												? 'bg-primary text-white dark:bg-dark dark:text-black'
												: 'bg-gray-100 text-gray-600 active:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:active:bg-gray-700'
										}`}
										onClick={() => setLove((prev) => !prev)}
									>
										love
									</button>
									<button
										type="button"
										className={`rounded-md px-2 py-0.5 text-xs transition-colors ${
											disabled
												? 'bg-primary text-white dark:bg-dark dark:text-black'
												: 'bg-gray-100 text-gray-600 active:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:active:bg-gray-700'
										}`}
										onClick={() => setDisabled((prev) => !prev)}
									>
										disabled
									</button>
									<button
										type="button"
										className={`rounded-md px-2 py-0.5 text-xs transition-colors ${
											showIcon
												? 'bg-primary text-white dark:bg-dark dark:text-black'
												: 'bg-gray-100 text-gray-600 active:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:active:bg-gray-700'
										}`}
										onClick={() => setShowIcon((prev) => !prev)}
									>
										icon
									</button>
									<button
										type="button"
										className={`rounded-md px-2 py-0.5 text-xs transition-colors ${
											showLoading
												? 'bg-primary text-white dark:bg-dark dark:text-black'
												: 'bg-gray-100 text-gray-600 active:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:active:bg-gray-700'
										}`}
										onClick={() => setShowLoading((prev) => !prev)}
									>
										loading
									</button>
									{showIcon ? (
										<button
											type="button"
											className={`rounded-md px-2 py-0.5 text-xs transition-colors ${
												iconPosition === 'left'
													? 'bg-primary text-white dark:bg-dark dark:text-black'
													: 'bg-gray-100 text-gray-600 active:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:active:bg-gray-700'
											}`}
											onClick={() => setIconPosition((prev) => (prev === 'left' ? 'right' : 'left'))}
										>
											iconPosition: {iconPosition}
										</button>
									) : null}
								</div>
							</div>

							<div>
								<div className="mb-2 break-all text-left text-xs text-gray-500 dark:text-gray-400">
									{isZh ? '更多属性： ' : 'More Props: '}
									<span className="text-gray-400 dark:text-gray-500">
										heightOut, heightIn, customSize, customWidth, customHeight, disabledLoading, injClass, type, onClick...
									</span>
									<a href="/components" className="ml-2 whitespace-nowrap text-primary hover:underline dark:text-dark">
										{isZh ? '查看更多示例' : 'View more examples'}
									</a>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-4">
							<div className="flex flex-1 items-center justify-center rounded-2xl border border-gray-200/50 bg-base shadow-xl dark:border-white/10">
								<div className="w-full max-w-75">
									<Button
										fill={fill}
										state={buttonState}
										radius={radius}
										size={size}
										border={isLineFill ? border : undefined}
										love={love}
										disabled={disabled}
										icon={showIcon ? { name: 'ri-heart-line' } : null}
										iconPosition={iconPosition}
										loading={showLoading ? { type: '1_0' } : undefined}
										injClass={size === 'md' ? '!w-1/2' : size === 'sm' ? '!w-1/4' : ''}
									>
										{isZh ? '按钮' : 'Button'}
									</Button>
								</div>
							</div>

							<div className="rounded-2xl border border-gray-200/50 bg-gray-100 p-4 shadow-xl dark:border-white/10 dark:bg-gray-900">
								<div className="mb-3 flex items-center gap-2">
									<div className="size-3 rounded-full bg-red-500"></div>
									<div className="size-3 rounded-full bg-yellow-500"></div>
									<div className="size-3 rounded-full bg-green-500"></div>
									<span className="ml-2 text-xs text-gray-500">Button.tsx</span>
								</div>
								<pre className="whitespace-pre-wrap text-sm">
									<code dangerouslySetInnerHTML={{ __html: codePreview }} />
								</pre>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ApiPlayground;
