const STEAM_API_URL = "https://store.steampowered.com/api/appdetails";

export async function fetchSteamGame(appId) {
    const cc = "us";
    const targetUrl = `${STEAM_API_URL}?appids=${appId}&cc=${cc}&l=en`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        const result = await response.json();
        const data = JSON.parse(result.contents);

        if (!data[appId]?.success) {
            console.warn(`AppID ${appId} không hợp lệ hoặc không có dữ liệu.`);
            return null;
        }

        return data[appId].data;
    } catch (error) {
        console.error("Lỗi khi fetch dữ liệu qua proxy:", error);
        return null;
    }
}



