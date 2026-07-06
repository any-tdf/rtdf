import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu';
import GuidePage from './GuidePage';
import { useAppContext } from '../../store/appStore';

const GuideLayout = () => {
	const { lang, isShowNav, setIsShowNav, isWideScreen, setIsWideScreen } = useAppContext();
	const isZh = lang === 'zh_CN';
	const navigate = useNavigate();
	const location = useLocation();
	const [menuHeight, setMenuHeight] = useState(0);

	const menuList = useMemo(
		() => [
			{
				class: '常规',
				class_en: 'General',
				childs: [
					{ title: '快速上手', title_en: 'Quick start', nav: 'quick-start', doc: 'quickStart' },
					{ title: '更新日志', title_en: 'Changelog', nav: 'changelog', doc: 'changelog' },
					{ title: '主题配置', title_en: 'Theme', nav: 'theme', doc: 'theme' },
					{ title: '图标', title_en: 'Icon', nav: 'icon', doc: 'icon' },
					{ title: '函数式反馈', title_en: 'Functional Feedback', nav: 'feedback', doc: 'feedback' },
					{ title: '国际化', title_en: 'Internationalization', nav: 'internation', doc: 'internation' },
					{ title: '常见问题', title_en: 'FAQ', nav: 'faq', doc: 'faq' },
					{ title: '贡献指南', title_en: 'Contribution Guide', nav: 'contribution', doc: 'contribution' },
					{ title: '兼容性', title_en: 'Compatibility', nav: 'compatibility', doc: 'compatibility' },
					{ title: '升级指南', title_en: 'Upgrade Guide', nav: 'upgrade', doc: 'upgrade' }
				]
			},
			{
				class: '设计',
				class_en: 'Design',
				childs: [
					{ title: '色彩', title_en: 'Color', nav: 'color' },
					{ title: 'LOGO', title_en: 'LOGO', nav: 'logo' }
				]
			},
			{
				class: '工具',
				class_en: 'Tools',
				childs: [
					{ title: '主题生成器', title_en: 'Theme generator', nav: 'generator' },
					{ title: 'AI Skill', title_en: 'AI Skill', nav: 'skill', doc: 'skill' },
					{ title: '工具方法', title_en: 'Utils', nav: 'utils', doc: 'utils' },
					{ title: 'IDE 插件', title_en: 'IDE plugin', nav: 'vscode', doc: 'vscode' },
					{ title: '脚手架', title_en: 'Create cli', nav: 'create', doc: 'create' },
					{ title: '图标插件', title_en: 'Icon plugin', nav: 'icon-plugin', doc: 'iconPlugin' },
					{ title: 'MD 插件', title_en: 'MD plugin', nav: 'md', doc: 'mdPlugin' },
					{ title: '快捷键', title_en: 'Shortcut key', nav: 'shortkey' }
				]
			},
			{
				class: '其他',
				class_en: 'Other',
				childs: [
					{ title: '关于', title_en: 'About', nav: 'about', doc: 'about' },
					{ title: '里程碑', title_en: 'Milestone', nav: 'milestone', doc: 'milestone' },
					{ title: '计划', title_en: 'Future', nav: 'future', doc: 'future' }
				]
			}
		],
		[]
	);

	const flatMenuList = useMemo(() => menuList.flatMap((item) => item.childs), [menuList]);

	const currentNav = useMemo(() => {
		const path = location.pathname.replace('/guide', '').split('/').filter(Boolean)[0] || 'quick-start';
		return flatMenuList.find((item) => item.nav === path) || flatMenuList[0];
	}, [flatMenuList, location.pathname]);

	useEffect(() => {
		const updateHeight = () => {
			setMenuHeight(document.documentElement.clientHeight - 56);
		};
		updateHeight();
		window.addEventListener('resize', updateHeight);
		return () => window.removeEventListener('resize', updateHeight);
	}, []);

	const menuClick = (menu: { nav: string }) => {
		if (isShowNav) {
			setIsShowNav(false);
		}
		navigate(`/guide${menu.nav === 'quick-start' ? '' : `/${menu.nav}`}`);
	};

	const changeFull = () => {
		const next = !isWideScreen;
		setIsWideScreen(next);
		localStorage.setItem('isFull', next ? 'full' : 'notFull');
	};

	const editUrl = (nav: string, doc?: string) => {
		const baseUrl = 'https://github.com/any-tdf/rtdf/edit/main/';
		if (!doc) return baseUrl;
		return `${baseUrl}docs/mds/guide/${doc}${isZh ? '' : '_en'}.md`;
	};

	const shouldShowEdit = !location.pathname.includes('generator') && !['color', 'logo', 'shortkey'].includes(currentNav.nav);

	return (
		<div className="flex">
			<div
				className={`bg-bg-base dark:bg-bg-base-dark fixed top-14 -left-52 z-100 w-48 overflow-y-scroll border-black/10 transition-all duration-300 md:left-0 md:bg-transparent dark:border-white/20 dark:md:bg-transparent ${
					isShowNav ? 'left-0' : '-left-52'
				}`}
				style={{ height: `${menuHeight}px` }}
			>
				<Menu menuList={menuList} currentNav={currentNav.nav} onMenuClick={menuClick} showNum={false} />
			</div>
			<div className="w-screen md:pl-48">
				<div className={`px-4 ${location.pathname.includes('generator') ? 'pt-0 md:px-4 md:pt-0' : 'pt-4 md:px-8 md:pt-12'}`}>
					<GuidePage currentNav={currentNav.nav} />
				</div>
				{shouldShowEdit ? (
					<div className={`mx-auto flex gap-2 px-4 pb-8 text-xs ${isWideScreen ? 'max-w-full md:px-8' : 'max-w-7xl md:px-0'}`}>
						<a href={editUrl(currentNav.nav, currentNav.doc)} className="text-primary dark:text-dark flex w-full" target="_blank" rel="noreferrer">
							<span className="mr-1 h-4 w-4">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" style={{ fill: 'currentColor' }}>
									<path d="M12.8995 6.85431L17.1421 11.0969L7.24264 20.9964H3V16.7538L12.8995 6.85431ZM14.3137 5.44009L16.435 3.31877C16.8256 2.92825 17.4587 2.92825 17.8492 3.31877L20.6777 6.1472C21.0682 6.53772 21.0682 7.17089 20.6777 7.56141L18.5563 9.68273L14.3137 5.44009Z" />
								</svg>
							</span>
							{isZh ? '在 GitHub 上编辑' : 'Edit on GitHub'}
						</a>
					</div>
				) : null}
			</div>
			{!location.pathname.includes('generator') ? (
				<button
					className="bg-primary shadow-primary/50 dark:bg-dark dark:shadow-dark/50 fixed right-2 bottom-4 z-50 hidden h-8 w-8 cursor-pointer rounded-full p-1.5 text-white shadow-md md:block dark:text-black"
					onClick={changeFull}
					type="button"
				>
					{isWideScreen ? (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								d="M20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20ZM11 5H5V19H11V15H13V19H19V5H13V9H11V5ZM15 9L18 12L15 15V13H9V15L6 12L9 9V11H15V9Z"
								fill="currentColor"
							></path>
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								d="M20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20ZM11 5H5V10.999H7V9L10 12L7 15V13H5V19H11V17H13V19H19V13H17V15L14 12L17 9V10.999H19V5H13V7H11V5ZM13 13V15H11V13H13ZM13 9V11H11V9H13Z"
								fill="currentColor"
							></path>
						</svg>
					)}
				</button>
			) : null}
		</div>
	);
};

export default GuideLayout;
