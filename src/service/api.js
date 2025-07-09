// api.js (frontend)
export async function fetchSteamGame(appId) {
    try {
        const response = await fetch(`http://localhost:3001/api/steam/${appId}`);
        if (!response.ok) throw new Error('Network response not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi fetch từ proxy:", error);
        return null;
    }
}
