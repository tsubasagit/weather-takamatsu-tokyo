# 高松・東京 天気アプリ

高松（香川県）と東京（東京都）の天気を表示するシンプルなWebアプリです。
単一のHTMLファイルだけで動作し、ビルドやインストールは不要です。

## 特長

- 現在の気温・天気・体感温度・湿度・風速
- 3日間予報（日付/曜日・アイコン・最高/最低気温）
- 「🔄 更新」ボタンで再取得
- **APIキー不要**（データ元: [wttr.in](https://wttr.in)）

## 使い方

`index.html` をブラウザで開くだけです。

### ローカルサーバーで開く場合

```bash
python -m http.server 5599
# http://localhost:5599 を開く
```

## 都市の追加

`index.html` 内の `CITIES` 配列に1行追加するだけです。

```js
const CITIES = [
  { name: "高松", region: "香川県", query: "Takamatsu" },
  { name: "東京", region: "東京都", query: "Tokyo" },
  // { name: "大阪", region: "大阪府", query: "Osaka" },
];
```

## ライセンス

MIT
