export async function fetchSteamGame(appId) {
    try {
        const url = `http://localhost:3001/api/steam/${appId}`;
        console.log("Fetching từ:", url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi fetch từ proxy:", error.message);
        return null;
    }
}
