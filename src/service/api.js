const STEAM_API_URL = "https://store.steampowered.com/api/appdetails";

export async function fetchSteamGame(appId) {
    const cc = "us";
    const targetUrl = `${STEAM_API_URL}?appids=${appId}&cc=${cc}&l=en`;

    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error(`Steam API trả về lỗi: ${response.status}`);
        }

        const data = await response.json();

        if (!data[appId]?.success) {
            console.warn(`AppID ${appId} không hợp lệ hoặc không có dữ liệu.`);
            return null;
        }

        return data[appId].data;
    } catch (error) {
        console.error("❌ Lỗi khi fetch từ Steam API:", error.message || error);
        return null;
    }
}
