import { useMemo, type MouseEvent } from 'react';
import { switchTheme, themes } from 'rtdf/theme';
import { themeLabels } from '../data/homeData';
import { useAppContext } from '../store/appStore';

type ThemeSwitchProps = {
	vertical?: boolean;
};

const ThemeSwitch = ({ vertical = false }: ThemeSwitchProps) => {
	const { lang, currentColor, setCurrentColor } = useAppContext();
	const isZh = lang === 'zh_CN';

	const themeOptions = useMemo(() => themes, []);

	const selectColor = (event: MouseEvent, themeName: string) => {
		event.stopPropagation();
		setCurrentColor(themeName);
		localStorage.setItem('theme_color', themeName);
		switchTheme(themeName);
	};

	return (
		<div
			className={
				vertical ? 'theme-switch-grid my-2 grid max-h-60 gap-1 overflow-y-auto sm:max-h-none' : 'my-2 flex flex-row flex-wrap gap-2'
			}
		>
			{themeOptions.map((item) => (
				<button
					key={item.name}
					className={`flex items-center gap-1.5 rounded-sm border px-2 py-1 ${
						currentColor === item.name ? 'border-primary dark:border-dark' : 'border-gray-100 dark:border-gray-700'
					} cursor-pointer`}
					onClick={(event) => selectColor(event, item.name)}
					type="button"
				>
					<div className="flex h-4 w-6 shrink-0 overflow-hidden rounded-sm">
						<div className="flex w-1/2 items-center justify-center bg-gray-100">
							<div className="size-2.5 rounded-full" style={{ background: item['color-primary'] }}></div>
						</div>
						<div className="flex w-1/2 items-center justify-center bg-gray-800">
							<div className="size-2.5 rounded-full" style={{ background: item['color-dark'] }}></div>
						</div>
					</div>
					<div className="shrink-0 text-left text-xs font-normal whitespace-nowrap">
						{isZh ? themeLabels[item.name] || item.name : item.name}
					</div>
				</button>
			))}
		</div>
	);
};

export default ThemeSwitch;
