import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { logs, filename } = await request.json();
    
    const projectRoot = process.cwd();
    const logPath = join(projectRoot, filename);
    
    const logContent = logs.join('\n');
    writeFileSync(logPath, logContent, 'utf8');
    
    return NextResponse.json({ 
      success: true, 
      message: `Debug log saved to ${filename}`,
      path: logPath 
    });
  } catch (error) {
    console.error('Failed to save debug log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save debug log' }, 
      { status: 500 }
    );
  }
}