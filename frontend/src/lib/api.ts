import { isMockApiEnabled, mockApiFetch } from './mockApi';

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
    const normalizedPath = normalizePath(path);

    if (isMockApiEnabled()) {
        return mockApiFetch(normalizedPath, init);
    }

    const baseUrl = import.meta.env.VITE_API_URL;
    if (!baseUrl) {
        throw new Error('VITE_API_URL이 설정되지 않았습니다.');
    }

    return fetch(`${baseUrl.replace(/\/$/, '')}${normalizedPath}`, init);
}
