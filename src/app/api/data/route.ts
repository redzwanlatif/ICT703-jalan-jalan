import { list } from '@vercel/blob';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    if (process.env.NODE_ENV === 'development') {
      const dataDirectory = path.join(process.cwd(), 'public', 'data-travel-group-5');
      const files = await fs.readdir(dataDirectory);
      const jsonFiles = files.filter(file => file.endsWith('.json'));

      if (jsonFiles.length === 0) {
        return new Response(JSON.stringify({ error: 'No local travel data found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const sortedFiles = jsonFiles.sort((a, b) => {
        const aTime = parseInt(a.split('-').pop()?.split('.')[0] || '0', 10);
        const bTime = parseInt(b.split('-').pop()?.split('.')[0] || '0', 10);
        return bTime - aTime;
      });

      const latestFile = sortedFiles[0];
      const filePath = path.join(dataDirectory, latestFile);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);

      return new Response(JSON.stringify(jsonData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Production logic using Vercel Blob
      const { blobs } = await list({ prefix: 'data-travel-group-5/' });

      if (blobs.length === 0) {
        return new Response(JSON.stringify({ error: 'No travel data found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const sorted = blobs.sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

      const latestBlob = sorted[0];

      const response = await fetch(latestBlob.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch blob content: ${response.status}`);
      }

      const jsonData = await response.json();

      return new Response(JSON.stringify(jsonData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error loading data from blob storage or local files:', error);
    return new Response(
      JSON.stringify({ error: 'Error loading data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
