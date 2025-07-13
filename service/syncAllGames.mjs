// import fs from 'fs/promises';
// import path from 'path';
// import admin from 'firebase-admin';
// import fetch from 'node-fetch';
// import { fileURLToPath } from 'url';

// // ✅ Fix __dirname cho ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 🔐 Load key
// const serviceAccountPath = path.resolve(__dirname, '../finalproject-809ab-firebase-adminsdk-fbsvc-00f94a518a.json');
// const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf-8'));

// // 🔥 Firebase init
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });
// const db = admin.firestore();

// const STEAM_API_URL = "https://store.steampowered.com/api/appdetails";

// // 🛠️ Hàm fetch dữ liệu từ Steam (qua proxy)
// async function fetchSteamGame(appid) {
//     const targetUrl = `${STEAM_API_URL}?appids=${appid}&cc=us&l=en`;
//     const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

//     try {
//         const res = await fetch(proxyUrl);
//         const json = await res.json();
//         const contents = JSON.parse(json.contents);
//         const data = contents[appid];

//         if (!data?.success) return null;

//         const g = data.data;

//         return {
//             id: appid,
//             name: g.name,
//             image: g.header_image,
//             description: g.short_description,
//             price: g.is_free ? "Free" : g.price_overview?.final_formatted || "N/A",
//             genres: g.genres?.map(x => x.description) || [],
//             developer: g.developers?.[0] || "",
//             publisher: g.publishers?.[0] || "",
//             release_date: g.release_date?.date || "",
//             trailer: g.movies?.[0]?.webm?.max || null,
//         };
//     } catch (err) {
//         console.error(`❌ Lỗi khi fetch ${appid}:`, err.message);
//         return null;
//     }
// }

// // 📦 Hàm chính để đồng bộ
// async function syncAllGames() {
//     const docRef = db.collection("gameLists").doc("categories");
//     const snap = await docRef.get();

//     if (!snap.exists) {
//         console.error("❌ Không tìm thấy document categories.");
//         return;
//     }

//     const data = snap.data();
//     const allIds = new Set();

//     for (const category in data) {
//         const raw = data[category]?.[0];
//         if (typeof raw === "string") {
//             raw
//                 .split(",")
//                 .map(id => parseInt(id.trim()))
//                 .filter(id => !isNaN(id))
//                 .forEach(id => allIds.add(id));
//         }
//     }

//     console.log(`📦 Tổng số game cần fetch: ${allIds.size}`);

//     const result = {};
//     for (const id of allIds) {
//         const game = await fetchSteamGame(id);
//         if (game) {
//             result[id] = game;
//             console.log(`✅ ${game.name}`);
//         } else {
//             console.log(`⚠️ Không lấy được game ID ${id}`);
//         }
//     }

//     await db.collection("gameLists").doc("allGames").set(result);
//     console.log("🎉 Đã lưu xong vào Firestore.");
// }

// syncAllGames();
