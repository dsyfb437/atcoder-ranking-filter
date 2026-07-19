import axios from 'axios';
import fs from 'fs';

const MY_COOKIE = 'REVEL_SESSION=YOUR_COOKIE'; // 替换你的 Cookie

const contests = [
    { id: 'arc224', min: 1, max: 2382 },
    { id: 'abc467', min: 1,  max: 10456 },
    { id: 'arc225', min: 1, max: 1553 }
];

// 缓存文件名映射
const CACHE_DIR = './cache';
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);

async function fetchOrReadCache(contestId, cookie) {
    const cacheFile = `${CACHE_DIR}/${contestId}.json`;
    // 如果缓存存在，直接读取
    if (fs.existsSync(cacheFile)) {
        console.log(`📂 从缓存读取 ${contestId}`);
        const data = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
        return data.StandingsData || [];
    }
    // 否则请求网络
    console.log(`⏳ 请求 ${contestId} ...`);
    const url = `https://atcoder.jp/contests/${contestId}/standings/json`;
    const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookie }
    });
    // 保存到缓存
    fs.writeFileSync(cacheFile, JSON.stringify(response.data, null, 2), 'utf-8');
    console.log(`💾 已缓存 ${contestId}`);
    return response.data.StandingsData || [];
}

async function main() {
    const allUserSets = [];
    for (const contest of contests) {
        const standings = await fetchOrReadCache(contest.id, MY_COOKIE);
        const users = [];
        for (const entry of standings) {
            const rank = entry.Rank;
            const name = entry.UserScreenName;
            if (rank && name && rank >= contest.min && rank <= contest.max) {
                users.push(name);
            }
        }
        allUserSets.push(new Set(users));
        console.log(`✅ ${contest.id} 符合区间用户数: ${users.length}`);
    }

    // 取交集
    let intersection = allUserSets[0];
    for (let i = 1; i < allUserSets.length; i++) {
        intersection = new Set([...intersection].filter(u => allUserSets[i].has(u)));
    }
    const result = Array.from(intersection);
    console.log(`\n🎉 最终交集人数: ${result.length}`);
    if (result.length > 0) {
        console.log('用户名:', result.join(', '));
        fs.writeFileSync('qualified_users.txt', result.join('\n'), 'utf-8');
    }
}

main();