# Amazon公式セラー絞り込みトグル 🔄（p_6:AN1VRQENFRJN5 / &emi=AN1VRQENFRJN5 対応）

## 📌 概要

Amazon.co.jp の検索結果に、**「Amazon公式セラー（p_6:AN1VRQENFRJN5）」の絞り込みトグルスイッチ**を直接追加するユーザースクリプトです。  
怪しいマーケットプレイス商品を除外して、Amazon直販の信頼できる商品だけをサッと表示できます。  
これまで手動で URL に `&emi=AN1VRQENFRJN5` を追加していた方、**もうその手間は不要です！**

<p>
  <img src=".github/images/amazon-official-seller-filter-toggle-image01.png" alt="Amazon検索フォームに表示されたトグルスイッチUI" width="600">
</p>

- セラー絞り込みURL（`p_6=AN1VRQENFRJN5` または `&emi=AN1VRQENFRJN5` 相当）をトグルで切替
- 検索フォームにスイッチUIを自動挿入
- 動的ルーティング（SPA）に完全対応
- Amazonのレイアウト崩れ（nav-active 問題）を自動修復
- 入力フォームの挙動と完全統合（エンターキー、サジェスト選択も対応）

## 🧩 対応サイト

- `https://www.amazon.co.jp/s*`（Amazon検索結果ページ）

## ⚙️ インストール方法

1. お使いのブラウザに Violentmonkey または Tampermonkey を導入
2. **[このスクリプトをインストールする](https://raw.githubusercontent.com/koyasi777/amazon-seller-filter-toggle/main/amazon-official-seller-filter-toggle.user.js)** ← クリックで直接インストール！
3. 自動でインストール画面が開きます。「インストール」を押せば完了！

## 💡 機能詳細

- トグルスイッチで `p_6=AN1VRQENFRJN5`（または `&emi=AN1VRQENFRJN5` 相当）のフィルターをON/OFF
- 現在の絞り込み状態を視覚的に表示（色付きラベル）
- キーワード入力・Enterキー・サジェストクリックのすべてに反応
- URLの `rh` パラメータ（または `emi` 相当）を動的に変更し、即座に検索結果を更新
- フィルター状態は `localStorage` に保存され、ページ遷移後も維持
- レスポンシブ対応。Amazon側レイアウト変更にも柔軟に追従

## ⛓️ 従来のやり方と比較

| 方法 | 説明 | 問題点 |
|------|------|--------|
| `&emi=AN1VRQENFRJN5` を URL に手入力 | 検索結果URLの末尾にパラメータを毎回手動追加 | 面倒・忘れやすい・スマホでは特に不便 |
| このスクリプトを使う | トグルUIでフィルターON/OFFが即切替 | 一度導入すればずっと自動で快適！ |

## 🛠 技術構成

- `localStorage` にトグル状態を記録し、再訪時も維持
- `MutationObserver` による動的なサジェスト選択対応
- `history.pushState` のフックで SPA ナビゲーションに完全追従
- `requestIdleCallback()` による最適なマウントタイミング
- `.nav-active` クラス自動除去によるレイアウト崩れ防止

## 🔗 関連リンク

- [Violentmonkey公式サイト](https://violentmonkey.github.io/)
- [Tampermonkey公式サイト](https://www.tampermonkey.net/)
- [このスクリプトのGitHubリポジトリ](https://github.com/koyasi777/amazon-seller-filter-toggle)

## 📜 ライセンス

MIT License  
自由に改変・再配布いただけますが、利用は自己責任でお願いします。

---

> 「&emi=AN1VRQENFRJN5 を毎回打つのが面倒すぎる…」  
> そんなあなたのための1クリック解決スクリプトです。
