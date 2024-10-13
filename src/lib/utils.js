import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';

// @ts-ignore
export const cn = (...inputs) => {
	return twMerge(clsx(inputs));
};

/**
 * Converts a camelCase string to snake_case.
 *
 * @param {string} str
 * @returns {string}
 */
const toSnakeCase = (str) => {
	return str.replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Recursively converts all property names of an object from camelCase to snake_case.
 *
 * @param {Record<string, unknown>} obj
 * @returns {Record<string, unknown>}
 */
export const keysToSnakeCase = (obj) => {
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}

	if (Array.isArray(obj)) {
		// Recursively apply to arrays
		return obj.map(keysToSnakeCase);
	}

	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		const snakeKey = toSnakeCase(key);
		// Recursively apply to object properties
		result[snakeKey] = keysToSnakeCase(value);
	}

	return result;
};

/**
 * Converts a string from kebab or snake case to camel case.
 *
 * @param {string} str
 * @returns {string}
 */
const toCamelCase = (str) => {
	return str.replace(/([-_][a-z])/g, (group) =>
		group.toUpperCase().replace('-', '').replace('_', '')
	);
};

/**
 * Recursively converts all property names of an object from kebab or snake case to camel case.
 *
 * @param {Record<string, unknown>} obj
 * @returns {Record<string, unknown>}
 */
export const keysToCamelCase = (obj) => {
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}

	if (Array.isArray(obj)) {
		// @ts-ignore
		return obj.map(keysToCamelCase);
	}

	const result = {};
	for (const [key, value] of Object.entries(obj)) {
		const camelKey = toCamelCase(key);
		// @ts-ignore
		result[camelKey] = keysToCamelCase(value);
	}

	// @ts-ignore
	return result;
};

// @ts-ignore
export const flyAndScale = (node, params = { y: -8, x: 0, start: 0.95, duration: 150 }) => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	// @ts-ignore
	const scaleConversion = (valueA, scaleA, scaleB) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	// @ts-ignore
	const styleToString = (style) => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		// @ts-ignore
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

/**
 * Returns the first character of each of the given first and last names.
 *
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
export const getInitials = (firstName, lastName) => {
	return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

/**
 * A function that takes a string and returns a hex color code.
 * This function is used to generate a color based on the name of a user.
 *
 * @param {string} str The string to generate the color from.
 * @return {string} A hex color code.
 */
export const stringToColor = (str) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = '#';
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff;
		color += ('00' + value.toString(16)).substr(-2);
	}
	return color;
};

/**
 * Takes a given abbreviation and returns a new abbreviation where the last character
 * is replaced with a random uppercase letter from the alphabet. This function is
 * used to generate a color based on the name of a user.
 *
 * @param {string} abbreviation The abbreviation to modify.
 * @return {string | null} The modified abbreviation, or null if the input was invalid.
 */
export const getMixedAbbreviationAndRandomInitial = (abbreviation) => {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for (const postfix of alphabet) {
		const proposedInitial = abbreviation.slice(0, -1) + postfix;
		return proposedInitial.toUpperCase();
	}
	return null;
};
