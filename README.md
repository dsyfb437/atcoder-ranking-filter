# 📊 AtCoder 多场比赛排名交集筛选工具

感谢 [atcoder-api](https://codeforces.com/blog/entry/143111)

> 通过 AtCoder 官方 JSON 接口，自动抓取多场比赛的排名数据，并找出同时满足各场指定排名区间的用户。

## ✨ 功能特点

- 🔍 **自动抓取**：直接从 `https://atcoder.jp/contests/{contestId}/standings/json` 获取排名数据。
- ⚡ **本地缓存**：首次运行后保存 JSON 到 `cache/` 目录，后续修改条件无需重新请求网络，保护账号安全。
- 🎯 **精确筛选**：支持为每场比赛单独设定排名区间，取所有条件的交集。
- 📄 **结果导出**：将符合条件的用户名列表保存为 `qualified_users.txt`，方便后续使用。
- 🛡️ **低请求量**：每场比赛仅需 1 次网络请求，之后全为本地计算，安全高效。

## 📦 前置要求

- **Node.js** v14 或更高版本（推荐 LTS）
- **npm**（Node.js 自带）

## 🚀 快速开始

### 1. 克隆或下载本项目

```bash
git clone https://github.com/dsyfb437/atcoder-filter.git
cd atcoder-filter
```

### 2. 安装依赖

```bash
npm install axios
```

（如果需要，也可以添加 `dotenv` 用于管理 Cookie，本项目默认直接配置）

### 3. 配置你的 AtCoder Cookie

本项目需要模拟登录以获取 JSON 数据。请按以下步骤获取你的 Cookie：

1. 在浏览器中登录 [AtCoder](https://atcoder.jp)。
2. 按 `F12` 打开开发者工具，切换到 **Application**（应用程序）标签。
3. 左侧展开 **Cookies** → 点击 `https://atcoder.jp`。
4. 在右侧列表中找到名为 `REVEL_SESSION` 的条目，**复制其 `Value` 列的内容**（通常很长）。
5. 在项目根目录创建 `config.js` 文件（或直接编辑 `filter.js`），将 Cookie 字符串填入 `MY_COOKIE` 变量。

> ⚠️ **重要**：`REVEL_SESSION` 相当于你的登录凭证，**切勿提交到公开仓库**。建议将 `config.js` 添加到 `.gitignore`。
>
> 还有，最好别拿大号的cookie

### 4. 设置排名区间

编辑 `filter.js` 中的 `contests` 数组，按需修改比赛 ID 和排名区间：

```javascript
const contests = [
    { id: 'arc224', min: 1, max: 2382 },
    { id: 'abc467', min: 1,  max: 10456 },
    { id: 'arc225', min: 1, max: 1553 }
];
```

- `id`：AtCoder 的比赛标识（如 `abc466`、`arc224`）。
- `min` / `max`：你要筛选的排名区间（闭区间）。

### 5. 运行脚本

```bash
node filter.js
```

## 📂 输出结果

- 控制台会实时显示每场比赛获取的用户数、最终交集人数以及用户名列表。
- 同时，符合条件的用户名会逐行保存在 `qualified_users.txt` 文件中。

## 💾 缓存机制

- 首次运行会请求每场比赛的 JSON 数据，并存储在 `cache/` 目录下（例如 `cache/arc224.json`）。
- 后续再次运行脚本时，会优先读取缓存文件，**不再请求网络**。
- 如果你需要强制刷新某场比赛的数据，只需删除对应的缓存文件即可。

## 🛠️ 项目结构

```
.
├── filter.js            # 主脚本
├── qualified_users.txt  # 结果文件（自动生成）
```

## ⚠️ 注意事项

- **遵守 AtCoder 规则**：本工具仅用于个人学习研究，请勿高频请求或用于商业用途。
- **Cookie 安全**：不要将包含 Cookie 的配置文件提交到公开仓库。
- **网络环境**：首次运行需要能够正常访问 AtCoder（可能需要代理）。
- **数据准确性**：排名数据以 AtCoder 官方 JSON 接口返回为准。

（仅供娱乐）
