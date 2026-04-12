import { json } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from '$env/static/private';

const getAccessToken = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // Base64 인코딩 부분
            Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: SPOTIFY_REFRESH_TOKEN
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('스포티파이 토큰 요청 실패:', errorText);
        throw new Error('토큰을 가져오지 못했습니다.');
    }

    return response.json();
};

export const GET = async () => {
    try {
        const { access_token } = await getAccessToken();

        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        if (response.status === 204) {
            return json({ is_playing: false, message: "재생 중인 곡이 없음" });
        }

        const song = await response.json();
        return json(song);
    } catch (err) {
        console.error('GET 에러:', err);
        return json({ error: '서버 에러가 발생했습니다.' }, { status: 500 });
    }
};