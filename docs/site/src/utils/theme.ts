const legacyDefaultThemeNames = new Set(['STDF', 'RTDF', 'VTDF']);

export const defaultThemeName = 'ANYTDF';

export const normalizeThemeName = (themeName: string | null | undefined) => {
	if (!themeName || legacyDefaultThemeNames.has(themeName)) return defaultThemeName;
	return themeName;
};
