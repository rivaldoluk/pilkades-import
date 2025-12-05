import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token, nik } = req.body;
  if (!token || !nik || nik.length !== 18) {
    return res.status(400).json({ success: false, msg: "Data kurang" });
  }

  const filePath = path.join(process.cwd(), 'hasil_pilkades_2026', 'pemilih.json');
  const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));

  const user = data.find(u => u.token === token && u.nik === nik && u.voted === false);

  if (user) {
    // Tandai sudah vote (update JSON langsung)
    user.voted = true;
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return res.json({ success: true, msg: "Lanjut voting!" });
  } else {
    return res.status(400).json({ success: false, msg: "Token/NIK salah atau sudah vote" });
  }
}
