import { useMemo, useState } from 'react';
import { useAppContext } from '../store/appStore';

const Fund = () => {
	const { lang, setIsShowFund } = useAppContext();
	const isZh = lang === 'zh_CN';
	const [showWeChatPay, setShowWeChatPay] = useState(false);
	const [showAlipayPay, setShowAlipayPay] = useState(false);

	const isDeskDevice = useMemo(() => window.innerWidth >= 768, []);

	return (
		<div
			className="fixed left-0 top-0 flex h-screen w-screen flex-col justify-center bg-black/20 backdrop-blur"
			style={{ zIndex: 1000 }}
			onClick={() => setIsShowFund(false)}
		>
			<div
				className="mx-auto w-full rounded-xl bg-white p-4 shadow-lg md:w-200 md:p-8 dark:bg-gray-950"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex justify-between">
					<div className="text-xl font-bold">{isZh ? '支持' : 'Support'}</div>
					<div className="h-8">
						<a href="https://github.com/any-tdf/rtdf" target="_blank" rel="noreferrer">
							<img
								src="https://img.shields.io/github/stars/any-tdf/rtdf?logo=github&label=stars&color=000"
								alt="GitHub"
							/>
						</a>
					</div>
				</div>
				{isDeskDevice || (!showWeChatPay && !showAlipayPay) ? (
					<div className="mt-2 text-xs text-gray-500 md:mt-8">
						<p>
							{isZh
								? 'RTDF 是一个免费、开源、简单易用且精心打造的组件库。我们在组件设计开发、工具配套、文档建设等方面倾注了大量心血。如果 RTDF 为您带来了便利，希望您能给个 star 或打赏以示支持，感谢您的厚爱！'
								: 'RTDF is a free, open-source, easy-to-use, and carefully crafted component library. We have devoted tremendous effort to component design, development tools, and documentation. If RTDF has helped you, please consider showing your support with a star or donation. Thank you for your love!'}
						</p>
						<p className="text-md mt-2 font-bold">
							{isZh ? '无论如何，RTDF 都将怀着热爱继续前行！' : 'No matter what, RTDF will keep moving forward with love!'}
						</p>
					</div>
				) : null}
				<div
					className={`grid mt-4 gap-2 text-center md:mt-10 ${
						showWeChatPay || showAlipayPay ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'
					}`}
				>
					{isDeskDevice || (!showWeChatPay && !showAlipayPay) ? (
						<div className="group flex w-full flex-col justify-center rounded-lg border border-black/10 py-1 md:relative md:w-40 md:py-12 dark:border-white/10">
							<div className="mx-auto h-8 w-6">
								<img className="h-full w-full object-cover" src="/assets/fund/coffee.svg" alt="coffee" />
							</div>
							<a className="mx-2 block md:hidden" href="https://www.buymeacoffee.com/dufu1991" target="_blank" rel="noreferrer">
								<div className="site-external-link text-center font-bold">Buy Me a Coffee</div>
								<div className="mt-1 text-xs text-gray-500">
									{isZh ? '推荐非中国地区使用' : 'Recommended for non-China regions'}
								</div>
							</a>
							<a
								className="site-fund-overlay hidden bg-white px-1 py-12 opacity-0 transition-all duration-500 group-hover:opacity-95 md:block dark:bg-gray-950"
								href="https://www.buymeacoffee.com/dufu1991"
								target="_blank"
								rel="noreferrer"
							>
								<div className="site-external-link text-center font-bold">Buy Me a Coffee</div>
								<div className="mt-1 text-xs text-gray-500">
									{isZh ? '推荐非中国地区使用' : 'Recommended for non-China regions'}
								</div>
							</a>
						</div>
					) : null}
					{isDeskDevice || (!showWeChatPay && !showAlipayPay) ? (
						<div className="group flex w-full flex-col justify-center rounded-lg border border-black/10 py-1 md:relative md:w-40 md:py-12 dark:border-white/10">
							<div className="mx-auto h-8 w-8">
								<img className="h-full w-full object-cover" src="/assets/fund/paypal.svg" alt="paypal" />
							</div>
							<a className="mx-2 block md:hidden" href="https://paypal.me/dufu1991" target="_blank" rel="noreferrer">
								<div className="site-external-link text-center font-bold">PayPal</div>
								<div className="mt-1 text-xs text-gray-500">
									{isZh ? '推荐非中国地区使用' : 'Recommended for non-China regions'}
								</div>
							</a>
							<a
								className="site-fund-overlay hidden bg-white px-1 py-12 opacity-0 transition-all duration-500 group-hover:opacity-95 md:block dark:bg-gray-950"
								href="https://paypal.me/dufu1991"
								target="_blank"
								rel="noreferrer"
							>
								<div className="site-external-link text-center font-bold">PayPal</div>
								<div className="mt-1 text-xs text-gray-500">
									{isZh ? '推荐非中国地区使用' : 'Recommended for non-China regions'}
								</div>
							</a>
						</div>
					) : null}
					{isDeskDevice || !showAlipayPay ? (
						<div className="group flex w-full flex-col justify-center rounded-lg border border-black/10 py-1 md:relative md:w-40 md:py-12 dark:border-white/10">
							<div className={`mx-auto h-8 w-10 ${showWeChatPay ? 'hidden' : ''}`}>
								<img className="h-full w-full object-cover" src="/assets/fund/wechat_pay.svg" alt="wechat" />
							</div>
							<div
								className="mx-2 block md:hidden"
								onClick={() => setShowWeChatPay((prev) => !prev)}
							>
								{showWeChatPay ? (
									<>
										<div className="mt-1">
											<img className="mx-auto w-3/5 object-cover" src="/assets/fund/wp_code.png" alt="wechat" />
										</div>
										<div className="mt-1 text-xs text-gray-500">{isZh ? '微信扫一扫' : 'WeChat Scan'}</div>
									</>
								) : (
									<>
										<div className="site-external-link text-center font-bold">{isZh ? '微信赞赏' : 'WeChat Reward'}</div>
										<div className="mt-1 text-xs text-gray-500">{isZh ? '推荐中国地区使用' : 'Recommended for China regions'}</div>
									</>
								)}
							</div>
							<button
								onClick={() => setShowWeChatPay((prev) => !prev)}
								className={`site-fund-overlay hidden cursor-pointer bg-white px-1 opacity-0 transition-all duration-500 group-hover:opacity-95 md:block dark:bg-gray-950 ${
									showWeChatPay ? 'opacity-95' : ''
								}`}
								type="button"
							>
								{showWeChatPay ? (
									<>
										<div className="mt-0.5">
											<img className="site-fund-qr mx-auto object-cover" src="/assets/fund/wp_code.png" alt="wechat" />
										</div>
										<div className="mt-0.5 text-xs text-gray-500">{isZh ? '微信扫一扫' : 'WeChat Scan'}</div>
									</>
								) : (
									<>
										<div className="site-external-link mt-12 text-center font-bold">{isZh ? '微信赞赏' : 'WeChat Reward'}</div>
										<div className="mt-1 text-xs text-gray-500">{isZh ? '推荐中国地区使用' : 'Recommended for China regions'}</div>
									</>
								)}
							</button>
						</div>
					) : null}
					{isDeskDevice || !showWeChatPay ? (
						<div className="group flex w-full flex-col justify-center rounded-lg border border-black/10 py-1 md:relative md:w-40 md:py-12 dark:border-white/10">
							<div className={`mx-auto h-8 w-10 ${showAlipayPay ? 'hidden' : ''}`}>
								<img className="h-full w-full object-cover" src="/assets/fund/alipay.svg" alt="alipay" />
							</div>
							<div
								className="mx-2 block md:hidden"
								onClick={() => setShowAlipayPay((prev) => !prev)}
							>
								{showAlipayPay ? (
									<>
										<div className="mt-1">
											<img className="mx-auto w-3/5 object-cover" src="/assets/fund/ap_code.png" alt="alipay" />
										</div>
										<div className="mt-1 text-xs text-gray-500">{isZh ? '支付宝扫一扫' : 'Alipay Scan'}</div>
									</>
								) : (
									<>
										<div className="site-external-link text-center font-bold">{isZh ? '支付宝赞赏' : 'Alipay Reward'}</div>
										<div className="mt-1 text-xs text-gray-500">{isZh ? '推荐中国地区使用' : 'Recommended for China regions'}</div>
									</>
								)}
							</div>
							<button
								onClick={() => setShowAlipayPay((prev) => !prev)}
								className={`site-fund-overlay hidden cursor-pointer bg-white px-1 opacity-0 transition-all duration-500 group-hover:opacity-95 md:block dark:bg-gray-950 ${
									showAlipayPay ? 'opacity-95' : ''
								}`}
								type="button"
							>
								{showAlipayPay ? (
									<>
										<div className="mt-0.5">
											<img className="site-fund-qr mx-auto object-cover" src="/assets/fund/ap_code.png" alt="alipay" />
										</div>
										<div className="mt-0.5 text-xs text-gray-500">{isZh ? '支付宝扫一扫' : 'Alipay Scan'}</div>
									</>
								) : (
									<>
										<div className="site-external-link mt-12 text-center font-bold">{isZh ? '支付宝赞赏' : 'Alipay Reward'}</div>
										<div className="mt-1 text-xs text-gray-500">{isZh ? '推荐中国地区使用' : 'Recommended for China regions'}</div>
									</>
								)}
							</button>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default Fund;
