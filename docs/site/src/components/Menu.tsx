import type { MenuList, MenuListChild } from '../data/menuList';
import { useAppContext } from '../store/appStore';

type MenuProps = {
	menuList: MenuList[];
	currentNav: string;
	showNum?: boolean;
	onMenuClick: (menu: MenuListChild) => void;
};

const Menu = ({ menuList, currentNav, showNum = true, onMenuClick }: MenuProps) => {
	const { lang } = useAppContext();
	const isZh = lang === 'zh_CN';

	return (
		<div className="flex flex-col px-2 py-4">
			<span className="pb-3 text-xs opacity-60">
				{isZh ? '文档更新：' : 'Document last updated:'}
				<br />
				{isZh ? import.meta.env.VITE_BUILD_TIME_ZH : import.meta.env.VITE_BUILD_TIME_EN}
			</span>
			{menuList.map((menu) => (
				<div key={menu.class} className="text-xs">
					{isZh ? menu.class : menu.class_en}
					{showNum ? (isZh ? ` （${menu.childs.length}）` : ` (${menu.childs.length})`) : ''}
					<div className="my-2 ml-1 flex flex-col gap-3 border-l-2 border-black/10 pr-0 dark:border-white/20">
						{menu.childs.map((child) => (
							<button
								key={child.nav}
								className={`box-content -translate-x-0.5 cursor-pointer border-l-2 py-0.5 pl-2 text-left text-sm transition-all hover:font-bold ${
									child.nav === currentNav
										? 'border-primary text-primary dark:border-dark dark:text-dark font-bold'
										: 'border-transparent'
								}`}
								onClick={(event) => {
									event.preventDefault();
									onMenuClick(child);
								}}
								type="button"
							>
								{isZh ? child.title : child.title_en}
							</button>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export default Menu;
