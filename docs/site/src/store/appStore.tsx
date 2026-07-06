import React, { createContext, useContext } from 'react';

export type LangType = 'zh_CN' | 'en_US';
export type ThemeMode = 'light' | 'dark' | 'auto';

export type AppContextValue = {
	lang: LangType;
	setLang: (lang: LangType) => void;
	isShowNav: boolean;
	setIsShowNav: (show: boolean) => void;
	isCmdK: boolean;
	setIsCmdK: (show: boolean) => void;
	isShowFund: boolean;
	setIsShowFund: (show: boolean) => void;
	showThemeSwitch: boolean;
	setShowThemeSwitch: (show: boolean) => void;
	currentColor: string;
	setCurrentColor: (color: string) => void;
	themeMode: ThemeMode;
	setThemeMode: (mode: ThemeMode) => void;
	sysTheme: 'light' | 'dark';
	setSysTheme: (mode: 'light' | 'dark') => void;
	isWideScreen: boolean;
	setIsWideScreen: (full: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppContextProvider = AppContext.Provider;

export const useAppContext = (): AppContextValue => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('AppContext is not available.');
	}
	return context;
};
