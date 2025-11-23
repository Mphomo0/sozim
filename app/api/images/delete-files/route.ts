import { NextResponse, NextRequest } from 'next/server'
import * as https from 'https'

// The POST handler for the API route (i.e., when a POST request is sent to this endpoint)
export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body from the incoming request
    const { fileIds } = await req.json()

    // Validate that 'fileIds' is a non-empty array
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: 'fileIds array is required' }, // Return error if validation fails
        { status: 400 }
      )
    }

    // Call the function to delete files from ImageKit using the provided fileIds
    const response = await deleteFilesFromImageKit(fileIds)

    // Return the response from ImageKit as JSON
    return NextResponse.json(response)
  } catch (error) {
    // Log any unexpected errors
    console.error('Error deleting files:', error)

    // Return a 500 error response
    return NextResponse.json(
      { error: 'Failed to delete files' },
      { status: 500 }
    )
  }
}

// Helper function to delete files from ImageKit using their file IDs
async function deleteFilesFromImageKit(fileIds: string[]) {
  // Define HTTPS request options
  const options = {
    method: 'POST',
    hostname: 'api.imagekit.io',
    path: '/v1/files/batch/deleteByFileIds',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Replace with your actual ImageKit private API key
      // Note: In production, store this in environment variables
      Authorization: `Basic ${Buffer.from(
        `${process.env.IMAGEKIT_PRIVATE_KEY}:`
      ).toString('base64')}`,
    },
  }

  // Return a Promise that wraps the HTTPS request
  return new Promise((resolve, reject) => {
    // Create HTTPS request with defined options
    const req = https.request(options, (res) => {
      let data = ''

      // Listen for data events
      res.on('data', (chunk) => {
        data += chunk
      })

      // On end of response, parse JSON and resolve the Promise
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data)
          resolve(parsedData)
        } catch (error) {
          reject(error)
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(JSON.stringify({ fileIds }))
    req.end()
  })
}
