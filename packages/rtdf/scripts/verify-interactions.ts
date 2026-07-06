import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

type CheckResult = {
	name: string;
	ok: boolean;
	details: string[];
};

type SourceContract = {
	name: string;
	file: string;
	required: Array<string | RegExp>;
};

const packageRoot = resolve(import.meta.dir, '..');
const componentRoot = join(packageRoot, 'src/lib/components');
const typeFile = join(packageRoot, 'src/lib/types/index.ts');

const read = (filePath: string) => readFileSync(filePath, 'utf8');

const hasPattern = (source: string, pattern: string | RegExp) => {
	if (typeof pattern === 'string') return source.includes(pattern);
	return pattern.test(source);
};

const checkContracts = (contracts: SourceContract[]) => {
	const missing: string[] = [];
	for (const contract of contracts) {
		const filePath = join(componentRoot, contract.file);
		if (!existsSync(filePath)) {
			missing.push(`${contract.name}: missing file ${contract.file}`);
			continue;
		}
		const source = read(filePath);
		for (const pattern of contract.required) {
			if (!hasPattern(source, pattern)) {
				missing.push(`${contract.name}: ${pattern.toString()}`);
			}
		}
	}
	return {
		name: 'source interaction contracts',
		ok: missing.length === 0,
		details: [`checked ${contracts.length} high-risk component contracts`, ...(missing.length ? [`missing: ${missing.join(', ')}`] : [])],
	} satisfies CheckResult;
};

const stateContracts: SourceContract[] = [
	{
		name: 'ImagePreview current',
		file: 'imagePreview/index.tsx',
		required: ['const [innerCurrent, setInnerCurrent] = useState(currentProp);', 'setInnerCurrent(currentProp);', 'setInnerCurrent(newIndex);', 'onChange?.(index);'],
	},
	{
		name: 'Accordion activeIndex',
		file: 'accordion/index.tsx',
		required: [
			'const [innerActive, setInnerActive] = useState<number | number[] | undefined>(activeIndexProp);',
			'setInnerActive(activeIndexProp);',
			'setInnerActive(currentActive);',
			'setInnerActive(nextActive);',
		],
	},
	{
		name: 'List batch state',
		file: 'list/index.tsx',
		required: [
			'const batchMode = innerBatchMode;',
			'const batchSelected = innerBatchSelected;',
			'setInnerBatchMode(nextMode);',
			'setInnerBatchSelected(nextSelected);',
			'onBatchModeChange?.(nextMode);',
		],
	},
	{
		name: 'Checkbox checkeds',
		file: 'checkbox/index.tsx',
		required: ['const currentCheckeds = internalCheckeds;', 'setInternalCheckeds(safeCheckeds);', 'setInternalCheckeds(newCheckeds);', 'onChange?.(newCheckeds);'],
	},
	{
		name: 'Radio value',
		file: 'radio/index.tsx',
		required: ['const currentValue = internalValue;', 'setInternalValue(safeValue);', 'setInternalValue(name);', 'onChange?.(name);'],
	},
	{
		name: 'ImageList value',
		file: 'imageList/index.tsx',
		required: ['const value = innerValue;', 'setInnerValue(initialValue);', 'setInnerValue([...value, ...newItems]);', 'setInnerValue(value.filter((_, i) => i !== index));'],
	},
	{
		name: 'NumKeyboard value',
		file: 'numKeyboard/NumKeyboard.tsx',
		required: ['const currentValue = internalValue;', 'setInternalValue(newValue);', 'setInternalValue(initialValue);', 'onClick?.(key);'],
	},
	{
		name: 'FullKeyboard value',
		file: 'fullKeyboard/index.tsx',
		required: ['const value = innerValue;', 'setInnerValue(nextValue);', 'setInnerValue(initialValue);', 'onClick?.(key);'],
	},
	{
		name: 'CodeInput value and focus',
		file: 'codeInput/index.tsx',
		required: [
			'const value = normalizeValue(innerValue);',
			'const focused = innerFocused;',
			'setInnerValue(normalizeValue(initialValue));',
			'setInnerFocused(initialFocused);',
			'setInnerValue(newValue);',
		],
	},
];

const popupContracts: SourceContract[] = [
	{
		name: 'Dialog popup callbacks',
		file: 'dialog/index.tsx',
		required: ['splitPopupCallbacks(popup)', 'popupOnclose?.();', 'popupOnClose?.();', 'onClose?.();', 'onclose?.();'],
	},
	{
		name: 'Modal popup callbacks',
		file: 'modal/index.tsx',
		required: ['splitPopupCallbacks(popup)', 'popupOnclose?.();', 'popupOnClose?.();', 'onClose?.();', 'onclose?.();'],
	},
	{
		name: 'ActionSheet close paths',
		file: 'actionSheet/index.tsx',
		required: ['splitPopupCallbacks(popup)', 'onCancel?.();', 'oncancel?.();', 'onClose?.();', 'onclose?.();', 'onClickAction?.(index, action);'],
	},
	{
		name: 'Picker confirm and cancel',
		file: 'picker/index.tsx',
		required: ['splitPopupCallbacks(popup)', 'onCancel?.();', 'oncancel?.();', 'onConfirm?.(items, scrollEndIndexsRef.current);', 'onconfirm?.(items, scrollEndIndexsRef.current);'],
	},
	{
		name: 'Calendar confirm and close',
		file: 'calendar/Calendar.tsx',
		required: ['splitPopupCallbacks(popup)', 'onConfirm?.(formattedDates);', 'onconfirm?.(formattedDates);', 'onClose?.();', 'onclose?.();'],
	},
	{
		name: 'TimePicker confirm and close',
		file: 'timePicker/TimePicker.tsx',
		required: ['splitPopupCallbacks(popup)', 'onCancel?.();', 'oncancel?.();', 'onConfirm?.(getTimeStr', 'onconfirm?.(getTimeStr', 'onClose?.();', 'onclose?.();'],
	},
	{
		name: 'AsyncPicker confirm and navigation',
		file: 'asyncPicker/index.tsx',
		required: ['splitPopupCallbacks(popup)', 'onPrev?.();', 'onprev?.();', 'onNext?.(currentIndex);', 'onnext?.(currentIndex);', 'onConfirm?.(newItems, newIndexs);'],
	},
	{
		name: 'ColorPicker close and copy',
		file: 'colorPicker/index.tsx',
		required: ['splitPopupCallbacks(popup)', 'onChange?.(colors);', 'onchange?.(colors);', 'onClose?.(colors);', 'onclose?.(colors);', 'onCopy?.(text);', 'oncopy?.(text);'],
	},
];

const localeContracts: SourceContract[] = [
	{
		name: 'ActionPopover locale',
		file: 'actionPopover/index.tsx',
		required: ['useConfig', 'zh_CN', 'actionPopoverLang'],
	},
	{
		name: 'ActionSheet locale',
		file: 'actionSheet/index.tsx',
		required: ['useConfig', 'zh_CN', 'actionSheetLang'],
	},
	{
		name: 'AsyncPicker locale',
		file: 'asyncPicker/index.tsx',
		required: ['useConfig', 'zh_CN', 'asyncPickerLang'],
	},
	{
		name: 'BottomSheet locale',
		file: 'bottomSheet/index.tsx',
		required: ['useConfig', 'zh_CN', 'bottomSheetLang'],
	},
	{
		name: 'Calendar locale',
		file: 'calendar/Calendar.tsx',
		required: ['useConfig', 'zh_CN', 'calendarLang'],
	},
	{
		name: 'Dialog locale',
		file: 'dialog/index.tsx',
		required: ['useConfig', 'zh_CN', 'dialogLang'],
	},
	{
		name: 'Feedback locale',
		file: 'feedback/Feedback.tsx',
		required: ['useConfig', 'zh_CN', 'feedbackState.setLang(locale || zh_CN);'],
	},
	{
		name: 'Form locale',
		file: 'form/index.tsx',
		required: ['useConfig', 'zh_CN', 'formLang', 'inputLang'],
	},
	{
		name: 'FullKeyboard locale',
		file: 'fullKeyboard/index.tsx',
		required: ['useConfig', 'zh_CN', 'fullKeyboardLang'],
	},
	{
		name: 'Input locale',
		file: 'input/index.tsx',
		required: ['useConfig', 'zh_CN', 'inputLang'],
	},
	{
		name: 'List locale',
		file: 'list/index.tsx',
		required: ['useConfig', 'zh_CN', 'listLang'],
	},
	{
		name: 'Modal locale',
		file: 'modal/index.tsx',
		required: ['useConfig', 'zh_CN', 'modalLang'],
	},
	{
		name: 'NavBar locale',
		file: 'navBar/index.tsx',
		required: ['useConfig', 'zh_CN', 'locale?.navBar'],
	},
	{
		name: 'NumKeyboard locale',
		file: 'numKeyboard/NumKeyboard.tsx',
		required: ['useConfig', 'zh_CN', 'commonLang'],
	},
	{
		name: 'Pagination locale',
		file: 'pagination/index.tsx',
		required: ['useConfig', 'zh_CN', 'paginationLang'],
	},
	{
		name: 'Picker locale',
		file: 'picker/index.tsx',
		required: ['useConfig', 'zh_CN', 'pickerLang'],
	},
	{
		name: 'Rate locale',
		file: 'rate/index.tsx',
		required: ['useConfig', 'zh_CN', 'rateLang.error1', 'rateLang.error5'],
	},
	{
		name: 'TimePicker locale',
		file: 'timePicker/TimePicker.tsx',
		required: ['useConfig', 'zh_CN', 'timePickerLang'],
	},
];

const checkNoControlledGuards = () => {
	const files = [
		'imagePreview/index.tsx',
		'accordion/index.tsx',
		'list/index.tsx',
		'checkbox/index.tsx',
		'radio/index.tsx',
		'imageList/index.tsx',
		'numKeyboard/NumKeyboard.tsx',
		'fullKeyboard/index.tsx',
		'codeInput/index.tsx',
	];
	const found = files.flatMap((file) => {
		const source = read(join(componentRoot, file));
		return ['hasOwnProperty.call(props', 'isControlled'].filter((pattern) => source.includes(pattern)).map((pattern) => `${file}: ${pattern}`);
	});
	return {
		name: 'bindable state guards',
		ok: found.length === 0,
		details: [`checked ${files.length} bindable-state components`, ...(found.length ? [`found: ${found.join(', ')}`] : [])],
	} satisfies CheckResult;
};

const checkEventAliases = () => {
	const typeSource = read(typeFile);
	const propMatches = [...typeSource.matchAll(/\b(on[a-z][A-Za-z0-9]*)\??:/g)].map((match) => match[1]);
	const propNames = [...typeSource.matchAll(/\b(on[A-Za-z][A-Za-z0-9]*)\??:/g)].map((match) => match[1]);
	const missing = propMatches
		.filter((prop) => prop !== 'onePageText')
		.filter((prop) => {
			const normalized = prop.toLowerCase();
			return !propNames.some((name) => name !== prop && name.toLowerCase() === normalized);
		});
	return {
		name: 'React event aliases',
		ok: missing.length === 0,
		details: [`checked ${propMatches.length} lowercase event props`, ...(missing.length ? [`missing aliases: ${missing.join(', ')}`] : [])],
	} satisfies CheckResult;
};

const checkSplitHelpers = () => {
	const helperSource = read(join(componentRoot, 'utils/events.ts'));
	const required = ['splitButtonCallbacks', 'splitPopupCallbacks', 'buttonOnclick', 'buttonOnClick', 'popupOnclose', 'popupOnClose'];
	const missing = required.filter((pattern) => !helperSource.includes(pattern));
	return {
		name: 'callback split helpers',
		ok: missing.length === 0,
		details: [`checked ${required.length} helper exports and callback fields`, ...(missing.length ? [`missing: ${missing.join(', ')}`] : [])],
	} satisfies CheckResult;
};

const checkBottomSheetAnimationParity = () => {
	const source = read(join(componentRoot, 'bottomSheet/index.tsx'));
	const required: Array<string | RegExp> = ['@any-tdf/react-motion/transition', 'useIsomorphicLayoutEffect', 'fly(node', 'runAnimationConfig(node, config', 'transition-all duration-300'];
	const forbidden: Array<string | RegExp> = ['createFlyFrame', /easingFunctions\.cubicOut/, /transition:\s*isTouch\s*\?/];
	const missing = required.filter((pattern) => !hasPattern(source, pattern)).map((pattern) => pattern.toString());
	const foundForbidden = forbidden.filter((pattern) => hasPattern(source, pattern)).map((pattern) => pattern.toString());
	return {
		name: 'BottomSheet animation parity',
		ok: missing.length === 0 && foundForbidden.length === 0,
		details: [
			'checked Svelte-compatible fly transition and fixed drag snap duration',
			...(missing.length ? [`missing: ${missing.join(', ')}`] : []),
			...(foundForbidden.length ? [`forbidden: ${foundForbidden.join(', ')}`] : []),
		],
	} satisfies CheckResult;
};

const checkActionPopoverInteractionParity = () => {
	const source = read(join(componentRoot, 'actionPopover/index.tsx'));
	const required: Array<string | RegExp> = [
		'useIsomorphicLayoutEffect',
		'const visible = visibleProp === undefined ? innerVisible : Boolean(visibleProp);',
		"const nextPositionReady = layout === 'ring' ? calculateRingLayout() : calculateInlinePosition();",
		"visibility: positionReady ? 'visible' : 'hidden'",
		'start: 0.5',
	];
	const forbidden: Array<string | RegExp> = ['const visible = innerVisible;', 'start: 0.92'];
	const missing = required.filter((pattern) => !hasPattern(source, pattern)).map((pattern) => pattern.toString());
	const foundForbidden = forbidden.filter((pattern) => hasPattern(source, pattern)).map((pattern) => pattern.toString());
	return {
		name: 'ActionPopover interaction parity',
		ok: missing.length === 0 && foundForbidden.length === 0,
		details: [
			'checked controlled visibility, mounted measurement, and Svelte scale start',
			...(missing.length ? [`missing: ${missing.join(', ')}`] : []),
			...(foundForbidden.length ? [`forbidden: ${foundForbidden.join(', ')}`] : []),
		],
	} satisfies CheckResult;
};

const checkKeyboardConfettiDemoParity = () => {
	const forbidden: Array<string | RegExp> = ['confettiDots', 'animate-ping'];
	const suites = [
		{
			name: 'FullKeyboard',
			demoRoot: join(packageRoot, 'src/pages/fullKeyboard'),
			files: ['zh_CN.tsx', 'en_US.tsx'],
			required: ['@any-tdf/react-confetti', '<Confetti rounded amount={100} />', "value9.toLowerCase() === 'hello'"],
		},
		{
			name: 'NumKeyboard',
			demoRoot: join(packageRoot, 'src/pages/numKeyboard'),
			files: ['zh_CN.tsx', 'en_US.tsx', 'index.tsx'],
			required: ['@any-tdf/react-confetti', '<Confetti rounded amount={100} />', "value === '5201314'"],
		},
	] satisfies Array<{ name: string; demoRoot: string; files: string[]; required: Array<string | RegExp> }>;
	const failures = suites.flatMap((suite) => {
		return suite.files.flatMap((file) => {
			const source = read(join(suite.demoRoot, file));
			const missing = suite.required.filter((pattern) => !hasPattern(source, pattern)).map((pattern) => `${suite.name}/${file} missing ${pattern.toString()}`);
			const foundForbidden = forbidden.filter((pattern) => hasPattern(source, pattern)).map((pattern) => `${suite.name}/${file} forbidden ${pattern.toString()}`);
			return [...missing, ...foundForbidden];
		});
	});
	return {
		name: 'Keyboard confetti demo parity',
		ok: failures.length === 0,
		details: ['checked Svelte-compatible Confetti imports and demo parameters', ...(failures.length ? failures : [])],
	} satisfies CheckResult;
};

const checkPopupTransitionStability = () => {
	const popupSource = read(join(componentRoot, 'popup/index.tsx'));
	const transitionSource = read(join(componentRoot, 'popup/Transition.tsx'));
	const required: Array<[string, string | RegExp]> = [
		['popup', 'useIsomorphicLayoutEffect'],
		['popup', 'setViewportSize(getViewportSize());'],
		['popup', 'const handleTransitionEnd = useCallback(() => {'],
		['popup', 'viewportHeight={innerHeight}'],
		['popup', 'viewportWidth={innerWidth}'],
		['transition', 'useMemo'],
		['transition', 'viewportHeight?: number;'],
		['transition', 'viewportWidth?: number;'],
		['transition', 'getFlyParams(position, size, transitionDistance, duration, easeType, viewportWidth, viewportHeight)'],
		['transition', 'getFlyParams(position, size, transitionDistance, outDuration, easeOutType, viewportWidth, viewportHeight)'],
	];
	const missing = required.filter(([file, pattern]) => !hasPattern(file === 'popup' ? popupSource : transitionSource, pattern)).map(([file, pattern]) => `${file}: ${pattern.toString()}`);
	return {
		name: 'Popup first-open transition stability',
		ok: missing.length === 0,
		details: ['checked viewport sync and stable transition params for content-measuring popups', ...(missing.length ? [`missing: ${missing.join(', ')}`] : [])],
	} satisfies CheckResult;
};

const checkMaskTransitionParity = () => {
	const source = read(join(componentRoot, 'mask/index.tsx'));
	const required: Array<string | RegExp> = [
		'MotionTransition',
		'const inParams = useMemo(() => ({ duration }), [duration]);',
		'const outParams = useMemo(() => ({ duration: outDuration }), [outDuration]);',
		"transition='fade'",
	];
	const forbidden: Array<string | RegExp> = ['@keyframes fadeIn', '@keyframes fadeOut', 'isAnimatingOut', 'setTimeout(() => {'];
	const missing = required.filter((pattern) => !hasPattern(source, pattern)).map((pattern) => pattern.toString());
	const foundForbidden = forbidden.filter((pattern) => hasPattern(source, pattern)).map((pattern) => pattern.toString());
	return {
		name: 'Mask transition parity',
		ok: missing.length === 0 && foundForbidden.length === 0,
		details: [
			'checked Svelte-compatible bidirectional fade without close flash',
			...(missing.length ? [`missing: ${missing.join(', ')}`] : []),
			...(foundForbidden.length ? [`forbidden: ${foundForbidden.join(', ')}`] : []),
		],
	} satisfies CheckResult;
};

const checkTooltipTransitionParity = () => {
	const source = read(join(componentRoot, 'tooltip/index.tsx'));
	const required: Array<string | RegExp> = [
		'useTransition',
		'tooltipFlyConfigObj',
		'inTransition: \'fly\'',
		'outTransition: \'fade\'',
		'duration: 200',
		'duration: 150',
		'tooltipTransition.shouldRender',
	];
	const missing = required.filter((pattern) => !hasPattern(source, pattern)).map((pattern) => pattern.toString());
	return {
		name: 'Tooltip transition parity',
		ok: missing.length === 0,
		details: ['checked Svelte-compatible tooltip fly-in and fade-out animation', ...(missing.length ? [`missing: ${missing.join(', ')}`] : [])],
	} satisfies CheckResult;
};

const checkAsyncPickerSelectedTransitionParity = () => {
	const source = read(join(componentRoot, 'asyncPicker/index.tsx'));
	const required: Array<string | RegExp> = [
		'MotionTransition',
		'selectedFlyInParams',
		'duration: 500',
		'selectedFlyOutParams',
		'duration: 300',
		"visible={!isLoading}",
		"transition='fly'",
		'document.documentElement.clientWidth',
	];
	const missing = required.filter((pattern) => !hasPattern(source, pattern)).map((pattern) => pattern.toString());
	return {
		name: 'AsyncPicker selected transition parity',
		ok: missing.length === 0,
		details: ['checked Svelte-compatible selected-item fly transition', ...(missing.length ? [`missing: ${missing.join(', ')}`] : [])],
	} satisfies CheckResult;
};

const checkModalStyleParity = () => {
	const source = read(join(componentRoot, 'modal/index.tsx'));
	const required: Array<string | RegExp> = [
		'size={0}',
		'duration={300}',
		'outDuration={150}',
		'maskClosable={!showBtn}',
		"radiusPosition='all'",
		"radius='lg'",
		"px='8'",
		'textAlignSpaceObj',
		"Button size='full'",
	];
	const forbidden: Array<string | RegExp> = ["radius='xl'", "className='w-full'", 'px-6 py-4'];
	const missing = required.filter((pattern) => !hasPattern(source, pattern)).map((pattern) => pattern.toString());
	const foundForbidden = forbidden.filter((pattern) => hasPattern(source, pattern)).map((pattern) => pattern.toString());
	return {
		name: 'Modal style parity',
		ok: missing.length === 0 && foundForbidden.length === 0,
		details: [
			'checked STDF-compatible adaptive center popup defaults',
			...(missing.length ? [`missing: ${missing.join(', ')}`] : []),
			...(foundForbidden.length ? [`forbidden: ${foundForbidden.join(', ')}`] : []),
		],
	} satisfies CheckResult;
};

const results = [
	checkNoControlledGuards(),
	checkContracts(stateContracts),
	checkContracts(popupContracts),
	checkContracts(localeContracts),
	checkEventAliases(),
	checkSplitHelpers(),
	checkBottomSheetAnimationParity(),
	checkActionPopoverInteractionParity(),
	checkKeyboardConfettiDemoParity(),
	checkPopupTransitionStability(),
	checkMaskTransitionParity(),
	checkTooltipTransitionParity(),
	checkAsyncPickerSelectedTransitionParity(),
	checkModalStyleParity(),
];

let failed = false;
for (const result of results) {
	const status = result.ok ? 'PASS' : 'FAIL';
	console.log(`\n${status} ${result.name}`);
	result.details.forEach((detail) => console.log(`  ${detail}`));
	if (!result.ok) failed = true;
}

if (failed) {
	console.error('\nInteraction verification failed.');
	process.exit(1);
}

console.log(`\nInteraction verification passed for ${results.length} checks.`);
