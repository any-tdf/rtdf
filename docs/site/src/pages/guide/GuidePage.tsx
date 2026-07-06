import { useEffect, useMemo, useRef, useState } from 'react';
import { groupIconMdPlugin, mdTextToHljs } from '../../utils';
import { useAppContext } from '../../store/appStore';
import ColorPage from './ColorPage';
import GeneratorPage from './GeneratorPage';
import LogoPage from './LogoPage';
import ShortkeyPage from './ShortkeyPage';
import BuiltInIconGallery from './BuiltInIconGallery';

const guideDocs = import.meta.glob('../../../../../docs/mds/guide/*.md');
const builtInIconGalleryMarker = '<!-- built-in-icon-gallery -->';

const navDocMap: Record<string, string> = {
	'quick-start': 'quickStart',
	'icon-plugin': 'iconPlugin',
	md: 'mdPlugin'
};

const GuidePage = ({ currentNav }: { currentNav: string }) => {
	const { lang, isWideScreen } = useAppContext();
	const isZh = lang === 'zh_CN';
	const [html, setHtml] = useState('');
	const [loading, setLoading] = useState(true);
	const loadDocSeq = useRef(0);
	const htmlParts = useMemo(() => html.split(builtInIconGalleryMarker), [html]);
	const showBuiltInIconGallery = currentNav === 'icon' && htmlParts.length > 1;

	const isCustomPage = useMemo(() => {
		return ['color', 'logo', 'shortkey', 'generator'].includes(currentNav);
	}, [currentNav]);

	useEffect(() => {
		const loadDoc = async () => {
			const seq = (loadDocSeq.current += 1);
			setLoading(true);
			if (isCustomPage) {
				setHtml('');
				setLoading(false);
				return;
			}
			const docKey = navDocMap[currentNav] || currentNav;
			const fileName = `${docKey}${isZh ? '' : '_en'}.md`;
			const filePath = Object.keys(guideDocs).find((key) => key.endsWith(`/guide/${fileName}`));
			if (!filePath) {
				setHtml('');
				setLoading(false);
				return;
			}
			const mod = (await guideDocs[filePath]()) as { default: string };
			if (seq !== loadDocSeq.current) return;
			const nextHtml = groupIconMdPlugin(
				mdTextToHljs(mod.default).replace(/<a href="/g, '<a target="_blank" href="')
			);
			setHtml(nextHtml);
			setLoading(false);
		};

		loadDoc();
	}, [currentNav, isCustomPage, isZh]);

	if (isCustomPage) {
		if (currentNav === 'color') return <ColorPage />;
		if (currentNav === 'generator') return <GeneratorPage />;
		if (currentNav === 'logo') return <LogoPage />;
		if (currentNav === 'shortkey') return <ShortkeyPage />;
	}

	if (loading) {
		return (
			<div className={`mx-auto pb-12 ${isWideScreen ? 'max-w-full' : 'max-w-7xl'}`}>
				<div className="rounded-xl bg-white/70 p-6 text-sm text-gray-600 dark:bg-gray-900/60 dark:text-gray-300">
					{isZh ? '请等待...' : 'Please wait...'}
				</div>
			</div>
		);
	}

	if (!html) {
		return (
			<div className={`mx-auto pb-12 ${isWideScreen ? 'max-w-full' : 'max-w-7xl'}`}>
				<div className="rounded-xl bg-white/70 p-6 text-sm text-gray-600 dark:bg-gray-900/60 dark:text-gray-300">
					{isZh ? '暂无内容。' : 'No content yet.'}
				</div>
			</div>
		);
	}

	return (
		<article
			className={`prose dark:prose-invert prose-strong:text-primary dark:prose-strong:text-dark mx-auto pb-12 ${
				isWideScreen ? 'max-w-full' : 'max-w-7xl'
			}`}
		>
			{showBuiltInIconGallery ? (
				<>
					<div dangerouslySetInnerHTML={{ __html: htmlParts[0] }}></div>
					<BuiltInIconGallery />
					<div dangerouslySetInnerHTML={{ __html: htmlParts.slice(1).join(builtInIconGalleryMarker) }}></div>
				</>
			) : (
				<div dangerouslySetInnerHTML={{ __html: html }}></div>
			)}
		</article>
	);
};

export default GuidePage;
