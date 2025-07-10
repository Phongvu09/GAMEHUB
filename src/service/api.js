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

export async function fetchSteamGame(appId) {
    try {
        const proxyUrl = "https://corsproxy.io/?";
        const steamUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=en`;

        const response = await fetch(proxyUrl + steamUrl);
        if (!response.ok) throw new Error('Steam fetch failed');
        const data = await response.json();
        return data[appId]; // dữ liệu chuẩn từ Steam
    } catch (error) {
        console.error("Lỗi khi fetch Steam (proxy):", error);
        return null;
    }
}

