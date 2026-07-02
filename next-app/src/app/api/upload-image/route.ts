import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { file, fileName } = body;
    if (!file || !fileName) {
      return NextResponse.json({ error: 'Missing file or fileName' }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: 'IMAGEKIT_PRIVATE_KEY not configured' }, { status: 500 });
    }

    const form = new FormData();
    form.append('file', file); 
    form.append('fileName', fileName);

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(privateKey + ':').toString('base64')}`
      },
      body: form
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'ImageKit upload failed');
    }

    return NextResponse.json({ url: data.url });
  } catch (error: any) {
    console.error('ImageKit upload error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
