import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // TODO: Save to your database (Supabase, MongoDB, Airtable, etc.)
    console.log('Shipping info received:', {
      tokenId: data.tokenId,
      name: data.name,
      email: data.email,
      address: data.address,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      shirtSize: data.shirtSize,
      timestamp: new Date().toISOString()
    })

    // For now, you could:
    // 1. Save to a Google Sheet via API
    // 2. Send to Airtable
    // 3. Email yourself the info
    // 4. Save to Supabase/Firebase

    // Example: Send email notification (you'd need to set up email service)
    // await sendEmail({
    //   to: 'fulfillment@nfabears.xyz',
    //   subject: `New Gift Box Order #${data.tokenId}`,
    //   body: JSON.stringify(data, null, 2)
    // })

    return NextResponse.json({
      success: true,
      message: 'Shipping info saved successfully'
    })

  } catch (error) {
    console.error('Error saving shipping info:', error)
    return NextResponse.json(
      { error: 'Failed to save shipping info' },
      { status: 500 }
    )
  }
}
