// import express from "express";
// import cors from "cors";
// import fetch from "node-fetch";

// const app = express();
// const PORT = 3001;

// app.use(cors());

// app.get("/api/steam/:appid", async (req, res) => {
//     const appid = req.params.appid;
//     const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&l=en`;

//     try {
//         const response = await fetch(url, {
//             headers: {
//                 "User-Agent": "Mozilla/5.0",
//                 "Accept": "application/json"
//             }
//         });

//         if (!response.ok) {
//             console.error(`❌ Steam API trả về status ${response.status}`);
//             return res.status(response.status).json({ error: "Steam API trả về lỗi" });
//         }

//         const data = await response.json();

//         if (!data[appid]?.success) {
//             return res.status(404).json({ error: "AppID không hợp lệ hoặc không có dữ liệu" });
//         }

//         res.json(data[appid].data);
//     } catch (err) {
//         console.error("❌ Lỗi tại server khi gọi Steam API:", err.message);
//         res.status(500).json({ error: "Lỗi server khi fetch dữ liệu từ Steam" });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`🚀 Steam proxy server đang chạy tại http://localhost:${PORT}`);
// });
