import { useAppContext } from '../../store/appStore';

const guideLineClass = 'stroke-gray-400 dark:stroke-gray-600';

const gridLines = Array.from({ length: 9 }, (_, index) => index * 10);

const LogoPage = () => {
	const { isWideScreen } = useAppContext();

	return (
		<div className={`mx-auto ${isWideScreen ? 'max-w-full' : 'max-w-7xl'}`}>
			<div className="mb-4 flex justify-around gap-3 text-9xl font-bold md:justify-start md:gap-10">
				<div className="text-dark dark:text-primary">R</div>
				<div className="text-primary dark:text-dark">T</div>
				<div className="text-primary dark:text-dark">D</div>
				<div className="text-primary dark:text-dark">F</div>
			</div>
			<div className="max-w-full md:max-w-md">
				<svg className="w-full" viewBox="0 0 91 81" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M0 0H20H40H50C64.8056 0 77.7325 8.04398 84.6487 20H50H40V22.6757V30H50C55.5229 30 60 34.4771 60 40C60 45.5229 55.5229 50 50 50H40V57.3243V78.7398V80H20V66.4583V20H15.3513H0V0ZM50 80C72.0914 80 90 62.0914 90 40C90 36.547 89.5625 33.1962 88.7398 30H67.3244C69.0261 32.9417 70 36.3571 70 40C70 51.0457 61.0457 60 50 60V80Z"
						className="fill-primary dark:fill-dark"
					/>
					<path d="M20 30V0L0 50H20V80L40 30H20Z" className="fill-dark dark:fill-primary" />
					{gridLines.map((line) => (
						<line
							key={`h-${line}`}
							y1={line + 0.9}
							x2="90"
							y2={line + 0.9}
							className={guideLineClass}
							strokeWidth="0.2"
							strokeDasharray="2 2"
						/>
					))}
					{gridLines.map((line) => (
						<line
							key={`v-${line}`}
							x1={line + 0.1}
							y1="0"
							x2={line + 0.1}
							y2="80"
							className={guideLineClass}
							strokeWidth="0.2"
							strokeDasharray="2 2"
						/>
					))}
					<circle cx="50" cy="40" r="39.9" className={guideLineClass} strokeWidth="0.2" strokeDasharray="2 2" />
					<circle cx="50" cy="40" r="19.9" className={guideLineClass} strokeWidth="0.2" strokeDasharray="2 2" />
					<circle cx="50" cy="40" r="9.9" className={guideLineClass} strokeWidth="0.2" strokeDasharray="2 2" />
				</svg>
			</div>
		</div>
	);
};

export default LogoPage;
