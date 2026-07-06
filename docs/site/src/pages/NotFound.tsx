import { Link } from 'react-router-dom';
import { useAppContext } from '../store/appStore';

const NotFound = () => {
	const { lang } = useAppContext();
	const isZh = lang === 'zh_CN';

	return (
		<div className="site-min-not-found mx-auto flex max-w-3xl flex-col items-center justify-center px-4 text-center">
			<h1 className="text-3xl font-bold">{isZh ? '页面未找到' : 'Page not found'}</h1>
			<p className="mt-3 text-sm text-gray-500">
				{isZh ? '请检查链接是否正确，或返回首页。' : 'Check the URL or go back to the home page.'}
			</p>
			<Link to="/" className="mt-6 rounded-full bg-primary px-6 py-2 text-sm font-bold text-white dark:bg-dark dark:text-black">
				{isZh ? '返回首页' : 'Back to Home'}
			</Link>
		</div>
	);
};

export default NotFound;
