// // server.js
// import express from 'express';
// import fetch from 'node-fetch';
// import cors from 'cors';

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(cors());

// app.get('/api/steam/:appid', async (req, res) => {
//     const appid = req.params.appid;
//     try {
//         const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&l=en`);
//         const data = await response.json();
//         res.json(data[appid]);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
