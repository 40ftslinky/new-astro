const assetUrls = import.meta.glob('/src/assets/**/*', {
	eager: true,
	import: 'default',
	query: '?url',
}) as Record<string, string>;

const CONTENT_ASSET_PATH = /^(?:\.\.\/\.\.\/)+assets\//;

function normalizeMediaPath(path: string) {
	if (path.startsWith('/src/assets/')) {
		return path;
	}

	if (path.startsWith('src/assets/')) {
		return `/${path}`;
	}

	if (CONTENT_ASSET_PATH.test(path)) {
		return `/${path.replace(CONTENT_ASSET_PATH, 'src/assets/')}`;
	}

	return path;
}

export function resolveMediaPath(path?: string) {
	if (!path) {
		return undefined;
	}

	if (/^(?:https?:)?\/\//.test(path) || path.startsWith('data:')) {
		return path;
	}

	const normalizedPath = normalizeMediaPath(path);

	return assetUrls[normalizedPath] ?? normalizedPath;
}