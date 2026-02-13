import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';

const handler = createMcpHandler(
  (server) => {
    // Tool: Get MAKO protocol info
    server.registerTool(
      'get_mako_info',
      {
        title: 'Get MAKO Protocol Info',
        description: 'Returns information about the MAKO protocol, including what it is, key features, and how it works',
        inputSchema: {
          topic: z.enum(['overview', 'features', 'how_it_works', 'cef', 'content_types', 'links']).optional().describe('Specific topic to get info about. Omit for a general overview.'),
        },
      },
      async ({ topic }) => {
        const info: Record<string, string> = {
          overview: `MAKO (Markdown Agent Knowledge Optimization) is an open protocol for serving LLM-optimized web content. It achieves 93% token reduction compared to raw HTML by converting web pages into structured Markdown with YAML frontmatter. The protocol uses HTTP content negotiation (Accept: text/mako+markdown) so AI agents get optimized content while browsers get normal HTML.`,

          features: `Key features of MAKO:
- 93% token reduction: A product page goes from 4,125 tokens (HTML) to 276 tokens (MAKO)
- Compact Embedding Format (CEF): 512-dim embeddings in ~470 bytes
- Declared actions: Machine-readable actions (add_to_cart, subscribe) with endpoints
- Semantic links: Internal, external links with context descriptions
- 10 content types: product, article, docs, landing, profile, listing, event, recipe, faq, custom
- 3 conformance levels: Level 1 (file), Level 2 (HTTP), Level 3 (CEF)`,

          how_it_works: `How MAKO works:
1. Agent sends HEAD request with Accept: text/mako+markdown
2. Server responds with X-Mako-* headers (token count, content type, CEF embedding)
3. Agent decodes the CEF embedding (~470 bytes) and checks cosine similarity
4. If relevant, agent sends GET for the full MAKO document
5. Agent receives structured Markdown with frontmatter, actions, and semantic links

This is fully backwards-compatible with existing HTTP infrastructure. Browsers that don't send the MAKO Accept header receive normal HTML.`,

          cef: `Compact Embedding Format (CEF):
- Compresses 512-dimension float32 embeddings into ~470 bytes
- Pipeline: float32[] → int8 quantization → gzip compression → base64url encoding
- Transmitted in a single HTTP header (X-Mako-Embedding)
- Preserves >98% cosine similarity correlation with original vectors
- Enables pre-download relevance filtering without fetching content`,

          content_types: `MAKO content types:
1. product - E-commerce product pages
2. article - Blog posts, news, editorial content
3. docs - Technical documentation
4. landing - Marketing and landing pages
5. profile - Person or organization profiles
6. listing - Category pages, search results
7. event - Events, conferences, meetups
8. recipe - Cooking recipes with structured data
9. faq - Frequently asked questions
10. custom - Any other content type`,

          links: `MAKO ecosystem links:
- Specification: https://github.com/juanisidoro/mako-spec
- JS Library: https://www.npmjs.com/package/@mako-spec/js
- CLI Tool: https://www.npmjs.com/package/@mako-spec/cli
- Website: https://mako-site.vercel.app`,
        };

        const text = topic ? info[topic] || info.overview : info.overview;
        return { content: [{ type: 'text' as const, text }] };
      }
    );

    // Tool: Get install instructions
    server.registerTool(
      'get_install_instructions',
      {
        title: 'Get MAKO Install Instructions',
        description: 'Returns installation and setup instructions for the MAKO JS library or CLI tool',
        inputSchema: {
          package: z.enum(['js', 'cli']).describe('Which package to get instructions for'),
        },
      },
      async ({ package: pkg }) => {
        const instructions: Record<string, string> = {
          js: `Install @mako-spec/js:

npm install @mako-spec/js

Usage:
\`\`\`typescript
import { parseMakoFile, validateMakoFile, cefEncode, cefDecode } from '@mako-spec/js';

// Parse a .mako.md file
const file = parseMakoFile(content);
console.log(file.frontmatter.entity); // "Nike Air Max 90"
console.log(file.frontmatter.tokens); // 276

// Validate
const result = validateMakoFile(file);
console.log(result.valid); // true

// CEF encode/decode
const encoded = cefEncode(embedding); // ~470 bytes string
const decoded = cefDecode(encoded, 512);
\`\`\`

Express middleware:
\`\`\`typescript
import { makoMiddleware } from '@mako-spec/js/middleware/express';

app.use(makoMiddleware({ dir: './mako-files' }));
\`\`\``,

          cli: `Install @mako-spec/cli:

npm install -g @mako-spec/cli

Commands:

# Validate MAKO files
mako validate "content/**/*.mako.md"
mako validate product.mako.md --strict

# Inspect a MAKO file
mako inspect content/product.mako.md
mako inspect content/product.mako.md --json

# Create a new MAKO file from template
mako init content/product.mako.md --type product --entity "Nike Air Max 90" --lang en

Or use with npx:
npx @mako-spec/cli validate "content/**/*.mako.md"`,
        };

        return { content: [{ type: 'text' as const, text: instructions[pkg] }] };
      }
    );
  },
  {},
  { basePath: '/api', maxDuration: 60 }
);

export { handler as GET, handler as POST };
