// tiktok.js
const fetchTikTokVideo = async (url) => {
    const apiUrl = `https://api.siputzx.my.id/api/tiktok?url=${encodeURIComponent(url)}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching TikTok video:", error);
        return null;
    }
};

export default fetchTikTokVideo;
