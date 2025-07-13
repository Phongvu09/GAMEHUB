// export async function fetchSteamGame(appId) {
//     try {
//         const url = `http://localhost:3001/api/steam/${appId}`;
//         console.log("Fetching từ:", url);
//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("Lỗi khi fetch từ proxy:", error.message);
//         return null;
//     }
// }


const STEAM_API_URL = "https://store.steampowered.com/api/appdetails";

export async function fetchSteamGame(appId) {
    const cc = "us";
    const targetUrl = `${STEAM_API_URL}?appids=${appId}&cc=${cc}&l=en`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);

        if (!response.ok) throw new Error("Proxy fetch failed");

        const result = await response.json();

        if (!result?.contents) {
            console.warn(`⚠️ Proxy không trả về nội dung cho AppID: ${appId}`);
            return null;
        }

        const data = JSON.parse(result.contents);

        if (!data[appId]?.success) {
            console.warn(`⚠️ AppID ${appId} không hợp lệ hoặc không có dữ liệu.`);
            return null;
        }

        return data[appId].data;
    } catch (error) {
        console.error("❌ Lỗi khi fetch dữ liệu qua proxy:", error.message);
        return null;
    }
}
