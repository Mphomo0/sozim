import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || 'Sozim Trading and Consultancy'
  const description = searchParams.get('description') || 'Accredited education and professional trading courses in South Africa'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          backgroundColor: '#0f172a',
          padding: '60px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e293b 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '80px',
            width: '200px',
            height: '100px',
            background: 'white',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#0f172a',
          }}
        >
          SOZIM
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: '900px',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              color: '#60a5fa',
              marginBottom: '16px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            South Africa
          </div>
          <div
            style={{
              fontSize: title.length > 40 ? '48px' : '64px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '24px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#94a3b8',
              lineHeight: 1.5,
              maxWidth: '700px',
            }}
          >
            {description}
          </div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              Explore Courses
            </div>
            <div
              style={{
                border: '1px solid #475569',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              Contact Us
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '80px',
            fontSize: '14px',
            color: '#64748b',
          }}
        >
          www.sozim.co.za
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
