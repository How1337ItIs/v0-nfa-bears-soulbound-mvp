import { NextResponse } from 'next/server';

export async function POST() {
  // Simulate API processing with 300ms delay
  await new Promise(r => setTimeout(r, 300));
  
  return NextResponse.json({ 
    txHash: "0xtest" 
  });
} 