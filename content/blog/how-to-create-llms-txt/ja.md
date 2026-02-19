---
title: "AIエージェントが実際に活用する llms.txt の作り方"
description: "効果的な llms.txt ファイルの作成ガイド——AIエージェント向けの robots.txt。ChatGPT、Claude、Perplexity にあなたのサイトの内容を伝えましょう。"
---

# AIエージェントが実際に活用する llms.txt の作り方

`llms.txt` ファイルは、AIエージェントにあなたのウェブサイトの内容を伝える最もシンプルな方法です。LLM 版の `robots.txt` と考えてください——サイトのルートに配置するプレーンテキストファイルで、コンテンツ、構造、機能をAIに説明します。

エージェントがあなたのサイトの提供内容を知らなければ、推薦することはできません。セットアップはわずか5分です。

## llms.txt とは？

[llms.txt 標準](https://llmstxt.org)は、`https://yoursite.com/llms.txt` で提供されるテキストファイルを定義しており、AIエージェントに以下を提供します：

- サイトとビジネスの説明
- 主要ページとその目的
- コンテンツ構造とナビゲーションのヒント
- APIエンドポイントや特別な機能
- エージェントがすべきこととすべきでないこと

これは技術仕様ではありません——自然言語でエージェントと対話するためのものです。

## 基本構造

動作する最小限の `llms.txt`：

```markdown
# あなたのサイト名

> サイトの簡潔な説明（1-2文）。

## 主要ページ

- [ホーム](https://yoursite.com)：訪問者がここで見つけるもの
- [製品](https://yoursite.com/products)：製品カタログ
- [ブログ](https://yoursite.com/blog)：業界に関する記事
- [お問い合わせ](https://yoursite.com/contact)：連絡方法

## このサイトが提供するもの

価値提案を2-3文で説明してください。
あなたのトピックについてAIに質問する人にとって、なぜこのサイトが関連性を持つのでしょうか？
```

## 実例

[makospec.vercel.app](https://makospec.vercel.app/llms.txt) の `llms.txt`：

```markdown
# MAKO — Markdown Agent Knowledge Optimization

> LLM最適化されたウェブコンテンツを配信するためのオープンプロトコル。
> コンテンツネゴシエーションにより、トークン消費を約93%削減。

## ドキュメント

- [仕様](https://makospec.vercel.app/ja/docs/spec)：MAKOプロトコルの完全な仕様
- [CEFフォーマット](https://makospec.vercel.app/ja/docs/cef)：Compact Embedding Format
- [HTTPヘッダー](https://makospec.vercel.app/ja/docs/headers)：ヘッダーリファレンス
- [サンプル](https://makospec.vercel.app/ja/docs/examples)：製品、記事、ドキュメント

## ツール

- [アナライザー](https://makospec.vercel.app/ja/analyzer)：任意のURLからMAKOを生成
- [スコア](https://makospec.vercel.app/ja/score)：AI対応度監査（0-100）
- [ディレクトリ](https://makospec.vercel.app/ja/directory)：公開分析

## パッケージ

- npm：@mako-spec/js（TypeScript SDK）
- npm：@mako-spec/cli（CLIツール）
- WordPress：mako-wp プラグイン
```

## 効果的な llms.txt のコツ

### 具体的に、曖昧にしない

悪い例：「オンラインで物を販売しています。」
良い例：「B2B SaaS 在庫管理プラットフォーム。電子機器、家具、オフィス用品で2,000以上のSKUを取り扱い。」

### 主要なURLを含める

エージェントはこれらを使ってサイトを巡回します。最も重要な5-10ページをリストアップしましょう。

### 機能を明記する

サイトにAPI、検索、特別な機能がある場合は、記載してください：

```markdown
## API

- POST /api/search：クエリによる製品検索
- GET /api/products/:id：製品詳細をJSONで取得
```

### サイトの変更時に更新する

古い `llms.txt` はないよりも悪いです。新しいセクション、製品カテゴリ、機能を追加したら、ファイルを更新しましょう。

### 500行以内に収める

これはサマリーであり、完全なサイトマップではありません。エージェントにはコンテキストの制限があります。

## 配置場所

ファイルはドメインのルートで配信する必要があります：

```
https://yoursite.com/llms.txt
```

**静的サイト（HTML、Hugo、Astro）：** `llms.txt` を `public/` または `static/` フォルダに追加します。

**Next.js：** `public/llms.txt` を作成するか、`app/llms.txt/route.ts` にルートハンドラーを追加します。

**WordPress：** プラグインを使用するか、テーマのルートに追加するか、リライトルールを作成します。

**Nginx/Apache：** ファイルをウェブルートディレクトリに配置します。

## llms.txt と MAKO の比較

この2つの標準は互いに補完し合います：

| | llms.txt | MAKO |
|---|---|---|
| **スコープ** | サイトレベル | ページレベル |
| **目的** | サイトの提供内容を説明 | ページごとに最適化されたコンテンツを配信 |
| **フォーマット** | プレーンテキスト / Markdown | YAMLフロントマター + Markdownボディ |
| **最適な用途** | 発見とナビゲーション | コンテンツの消費とアクション |

`llms.txt` でエージェントがコンテンツを見つけられるようにしましょう。[MAKO](https://makospec.vercel.app/ja/docs) で効率的に配信しましょう。

## 動作確認

`llms.txt` を作成した後：

1. ブラウザで `https://yoursite.com/llms.txt` にアクセス——プレーンテキストとして表示されるはずです
2. [MAKO Score](https://makospec.vercel.app/ja/score) でサイトをチェック——「Has llms.txt」の項目がパスするはずです
3. ChatGPT や Claude に聞いてみましょう：「[yoursite.com] は何を提供していますか？」——`llms.txt` がインデックスされていれば、回答の質が向上します

5分の作業で、あなたのサイトを訪問するすべてのAIエージェントに対して永続的な可視性を得られます。
