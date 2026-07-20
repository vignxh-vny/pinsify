import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'PinCheck.in - Discover your Pinterest Lore'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '40px solid black',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Red Accent Box */}
        <div 
          style={{
            position: 'absolute',
            top: 60,
            left: 60,
            width: 100,
            height: 100,
            backgroundColor: '#E60023',
            border: '8px solid black',
            boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
          }}
        />

        {/* Decorative Stars */}
        <div style={{ position: 'absolute', top: 80, right: 100, fontSize: 80 }}>✨</div>
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            backgroundColor: 'white',
            padding: '40px 80px',
            border: '12px solid black',
            boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)',
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: 'black',
              letterSpacing: '-0.05em',
              textTransform: 'uppercase',
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            Check your<br/>Pinterest Lore
          </div>
          
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '20px',
              padding: '10px 30px',
              backgroundColor: 'black',
              color: 'white',
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            PINCHECK.IN
          </div>
        </div>

        {/* Floating elements */}
        <div style={{ position: 'absolute', bottom: 60, left: 80, fontSize: 40, fontWeight: 900, color: '#E60023' }}>* NO SIGN IN REQUIRED</div>
      </div>
    ),
    {
      ...size,
    }
  )
}
