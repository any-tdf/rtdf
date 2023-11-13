import React, { useState } from 'react';

const Button = ({
    fill,
    state,
    radius,
    size,
    line,
    injClass,
    love,
    heightOut,
    heightIn,
    group,
    disabled,
    customSize,
    customWidth,
    customHeight,
    children,
}) => {
    const [block] = useState((size === 'full' || size === 'big') && !customSize);
    const [textColor] = useState(state === 'theme' ? 'text-white dark:text-black' : 'text-white');

    const heightOutObj = { 0: 'py-0', 1: 'py-1', 2: 'py-2', 3: 'py-3', 4: 'py-4' };
    const heightInObj = { 0: 'py-0', 1: 'py-1', 2: 'py-2', 3: 'py-3', 4: 'py-4' };
    const sizeObj = { full: 'w-full', big: 'w-full', md: 'w-1/2', sm: 'w-1/4', auto: 'w-auto' };
    const lineObj = { solid: 'border-solid', dashed: 'border-dashed', dotted: 'border-dotted' };
    const stateObj = { theme: 'bg-primary dark:bg-dark', success: 'bg-success', warning: 'bg-warning', error: 'bg-error', info: 'bg-info' };
    const radiusObj = { none: 'rounded-none', base: 'rounded', xl: 'rounded-xl', '2xl': 'rounded-2xl', full: 'rounded-full' };
    const fillObj = {
        base: '',
        line: 'border border-black dark:border-white !text-black dark:!text-white',
        lineLight: 'border border-black/20 dark:border-white/30 !text-black dark:!text-white',
        lineTheme: 'border border-primary dark:border-dark !text-primary dark:!text-dark',
        text: '!text-black dark:!text-white',
        textTheme: '!text-primary dark:!text-dark',
        colorLight: '!bg-black/5 dark:!bg-white/10 !text-black dark:!text-white',
    };

    return (
        <div
            className={`${heightOutObj[heightOut] || heightOutObj['2']} ${size === 'big' && !customSize ? 'px-4' : 'px-0'} ${
                block ? 'block' : 'inline'
            } ${love ? 'text-xl' : ''}`}>
            <button
                className={`truncate ${!group && !disabled ? 'active:opacity-80' : ''} ${heightInObj[heightIn] || heightInObj['3']} ${
                    sizeObj[size] || sizeObj.big
                } ${textColor} ${lineObj[line] || lineObj.solid} ${radiusObj[radius] || radiusObj.base} ${
                    fill === 'base' && (state === 'theme' ? 'bg-primary dark:bg-dark' : 'bg-white dark:bg-black')
                } ${fill === 'base' && (stateObj[state] || stateObj.theme)} ${fillObj[fill] || fillObj.base} ${injClass} ${
                    disabled ? 'cursor-not-allowed opacity-50' : ''
                }`}
                disabled={disabled}
                style={customSize ? { width: customWidth + 'px', height: customHeight + 'px', padding: 0 } : {}}>
                {children}
            </button>
        </div>
    );
};

Button.defaultProps = {
    fill: 'base',
    state: 'theme',
    radius: 'base',
    size: 'big',
    line: 'solid',
    injClass: '',
    love: false,
    heightOut: '2',
    heightIn: '3',
    group: false,
    disabled: false,
    customSize: false,
    customWidth: 0,
    customHeight: 0,
    children: null,
};

export default Button;
