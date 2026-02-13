import { siteConfig } from '@/config/site';

export async function GET() {
  return Response.json({
    version: '1.0',
    servers: [
      {
        name: 'mako-site',
        description: 'MAKO protocol landing page — provides information about the MAKO specification, tools, and ecosystem',
        endpoint: `${siteConfig.baseUrl}/api/mcp`,
        capabilities: ['tools', 'resources'],
      },
    ],
  });
}
