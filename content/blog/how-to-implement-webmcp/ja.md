---
title: "WebMCPとは何か、あなたのサイトに追加する方法"
description: "WebMCPはAIエージェントがHTMLフォームを通じてサイトと対話できるようにする新しいW3C標準です。いくつかの属性で実装する方法を解説します。"
---

# WebMCPとは何か、あなたのサイトに追加する方法

AIエージェントがウェブサイトで何かを買ったり、商品を検索したり、テーブルを予約したりするたびに、人間のふりをしなければなりません。ブラウザを開き、画面を見て、ボタンをクリックし、各フィールドが何をするのか推測するのです。

動きます——一応は。でも遅くて、壊れやすくて、しょっちゅうエラーになります。

WebMCPはこの問題を解決します。既存のフォームにいくつかのHTML属性を追加するだけで、AIエージェントはあなたのサイトで何ができるかを即座に理解します。

## WebMCPとは

WebMCP（Web Model Context Protocol）は、GoogleとMicrosoftが支援する[W3C標準](https://webmachinelearning.github.io/webmcp/)です。ウェブサイトがインタラクティブな機能を宣言し、AIエージェントがそれを直接利用できるようにします——スクリーンスクレイピングも推測も不要です。

あなたは既にフォームを持っています：検索バー、チェックアウトフロー、予約ウィジェット。WebMCPを使えば、これらのフォームにセマンティック属性を付けて、エージェントが構造化されたツールとして理解できるようになります。

[Chrome 146](https://developer.chrome.com/blog/webmcp-epp)（2026年2月）でアーリープレビューとしてリリースされました。Firefox、Safari、Edgeは[W3Cワーキンググループ](https://webmachinelearning.github.io/webmcp/)に参加しています。

## 仕組み：フォームに属性を追加する

WebMCPなしの商品検索フォームです：

```html
<form action="/search">
  <input type="text" name="q" placeholder="商品を検索...">
  <button type="submit">検索</button>
</form>
```

人間には検索バーに見えます。AIエージェントには……テキスト入力欄に見えるだけです。何を検索するのか、何を入力すべきか、送信したら何が起きるのか分かりません。

WebMCPを追加した同じフォームです：

```html
<form action="/search"
      toolname="search_catalog"
      tooldescription="3,000以上の商品カタログを名前、ブランド、カテゴリで検索"
      toolautosubmit="true">

  <input type="text" name="q"
         toolparamtitle="クエリ"
         toolparamdescription="検索する商品名、ブランド、またはカテゴリ">

  <button type="submit">検索</button>
</form>
```

フォームに3つの属性、inputに2つ。エージェントはこのツールが何をするか正確に理解し、自信を持って使えるようになります。

### 属性一覧

**`<form>` の属性：**

| 属性 | 必須 | 用途 |
|---|---|---|
| `toolname` | はい | ツールの一意の識別子 |
| `tooldescription` | はい | フォームが何をするかの自然言語による説明 |
| `toolautosubmit` | いいえ | エージェントが全フィールドを入力したら自動送信 |

**`<input>`、`<select>`、`<textarea>` の属性：**

| 属性 | 用途 |
|---|---|
| `toolparamtitle` | フィールドの短いラベル |
| `toolparamdescription` | ここにどんなデータを入れるか（ラベルだけでは分かりにくい場合に便利） |

## ECサイトの例

### フィルター付き商品検索

```html
<form action="/products"
      toolname="find_products"
      tooldescription="価格やカテゴリのオプションフィルターで商品を検索">

  <input type="text" name="q"
         toolparamtitle="検索"
         toolparamdescription="商品名またはキーワード">

  <select name="category"
          toolparamtitle="カテゴリ"
          toolparamdescription="商品カテゴリで絞り込む">
    <option value="">すべてのカテゴリ</option>
    <option value="electronics">電子機器</option>
    <option value="clothing">衣料品</option>
    <option value="home">ホーム＆ガーデン</option>
  </select>

  <input type="number" name="max_price"
         toolparamtitle="上限価格"
         toolparamdescription="上限価格（円）">

  <button type="submit">検索</button>
</form>
```

誰かがAIアシスタントに_「5,000円以下のヘッドホンを探して」_と聞くと、エージェントはクエリを入力し、カテゴリを選択し、上限価格を設定して送信します。DOMを推測する必要はありません。

### カートに追加

```html
<form action="/cart/add" method="POST"
      toolname="add_to_cart"
      tooldescription="SKUと数量で商品をショッピングカートに追加"
      toolautosubmit="true">

  <input type="hidden" name="sku" value="SKU-7821"
         toolparamtitle="SKU"
         toolparamdescription="商品のSKU識別子">

  <input type="number" name="qty" value="1" min="1"
         toolparamtitle="数量"
         toolparamdescription="追加する個数">

  <button type="submit">カートに追加</button>
</form>
```

### 郵便番号で在庫確認

```html
<form action="/api/stock-check"
      toolname="check_local_stock"
      tooldescription="指定した郵便番号の近くの店舗で商品が受け取り可能か確認"
      toolautosubmit="true">

  <input type="hidden" name="product_id" value="12345">

  <input type="text" name="zip"
         toolparamtitle="郵便番号"
         toolparamdescription="近くの店舗を探すための7桁の郵便番号">

  <button type="submit">在庫を確認</button>
</form>
```

## JavaScript API

静的なフォームでは表現できない動的なツールには、命令型APIを使います：

```javascript
navigator.modelContext.registerTool({
  name: "get_shipping_estimate",
  description: "カートの配送料と配達予定日を計算",
  inputSchema: {
    type: "object",
    properties: {
      zip: {
        type: "string",
        description: "配送先の郵便番号"
      },
      method: {
        type: "string",
        description: "配送方法：standard、express、またはovernight"
      }
    },
    required: ["zip"]
  },
  execute: async (input) => {
    const res = await fetch(`/api/shipping?zip=${input.zip}&method=${input.method || 'standard'}`);
    return await res.json();
  }
});
```

`navigator.modelContext` APIは以下も提供します：
- `provideContext()` — 複数のツールを一括登録
- `unregisterTool(name)` — 特定のツールを削除
- `clearContext()` — 登録済みの全ツールを削除

完全なリファレンス：[W3C WebMCP Spec](https://webmachinelearning.github.io/webmcp/)。

## テスト方法

1. [Chrome Canary](https://www.google.com/chrome/canary/) をダウンロード
2. `chrome://flags/` を開き、**"WebMCP for testing"** を有効化
3. WebMCP Chrome拡張機能をインストール（[Google AI Studio](https://aistudio.google.com) の無料Gemini APIキーを使用）
4. WebMCP属性を持つ任意のページを開く——エージェントがフォームと対話できます

## 今すぐ実装すべき理由

WebMCPの追加は簡単です。既存のフォームに2、3個の属性を付けるだけ。バックエンドの変更不要、新しいファイル不要、APIの構築不要。

これらの属性がなくても、AIエージェントはあなたのサイトを使おうとします——ただし、遅くて信頼性の低いスクリーン自動化を通じてです。属性があれば、エージェントは開発者がAPIを使うようにフォームと対話します：直接的かつ正確に。

早期採用が重要です。WebMCPをサポートするエージェントが増えるにつれ、既にツールを宣言しているサイトがインタラクションを獲得します。宣言していないサイトは、質の悪いスクレイピングをされるだけです。

## WebMCP + llms.txt + MAKO

3つの標準、3つのレイヤー：

| 標準 | レイヤー | 役割 |
|---|---|---|
| **[llms.txt](/ja/blog/llms-txt-no-tsukurikata)** | 発見 | あなたのサイトが何についてかをエージェントに伝える |
| **WebMCP** | インタラクション | エージェントがフォームやツールを使えるようにする |
| **[MAKO](https://makospec.vercel.app/ja/docs)** | コンテンツ | ページごとにAI最適化されたコンテンツを配信 |

llms.txtは地図。WebMCPはインターフェース。MAKOはコンテンツ。3つが揃えば、訪れるすべてのAIエージェントにとって、あなたのサイトは完全にアクセス可能になります。

## 参考リンク

- [W3C WebMCP仕様](https://webmachinelearning.github.io/webmcp/)
- [Chrome Blog: WebMCP Early Preview](https://developer.chrome.com/blog/webmcp-epp)
- [GoogleChromeLabs/webmcp-tools](https://github.com/GoogleChromeLabs/webmcp-tools) — 公式デモとユーティリティ
