import { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { formType } = data

    // Validate form type
    if (!formType || !['contact', 'callback'].includes(formType)) {
      return new Response(JSON.stringify({ error: 'Invalid form type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create transporter using Webmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    let subject = ''
    let htmlContent = ''
    let textContent = ''

    // Helper to build table rows
    const tableRow = (label: string, value: string | undefined) =>
      `<tr><td style="padding: 5px; font-weight: bold; border: 1px solid #ddd;">${label}</td><td style="padding: 5px; border: 1px solid #ddd;">${
        value || 'Not provided'
      }</td></tr>`

    if (formType === 'contact') {
      const {
        firstName,
        lastName,
        email,
        phone,
        subject: userSubject,
        message,
      } = data

      subject = `Contact Form: ${userSubject || 'No Subject'}`

      htmlContent = `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse: collapse; width: 100%;">
          ${tableRow('Full Name', `${firstName} ${lastName}`)}
          ${tableRow('Email', email)}
          ${phone ? tableRow('Phone', phone) : ''}
          ${tableRow('Subject', userSubject)}
          ${tableRow('Message', message)}
        </table>
      `

      textContent = `
Full Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${userSubject || 'Not provided'}
Message:
${message}
      `
    } else if (formType === 'callback') {
      const {
        firstName,
        surname,
        email,
        cellphoneNumber,
        alternativeContactNumber,
        natureOfEnquiry,
        schoolOf,
        contactMethod,
        preferredContactTime,
        message,
      } = data

      subject = `Call Me Back Form Submission`

      htmlContent = `
        <h2>New Call Me Back Request</h2>
        <table style="border-collapse: collapse; width: 100%;">
          ${tableRow('Name', `${firstName} ${surname}`)}
          ${tableRow('Email', email)}
          ${tableRow('Phone', cellphoneNumber)}
          ${
            alternativeContactNumber
              ? tableRow('Alternative Contact Number', alternativeContactNumber)
              : ''
          }
          ${tableRow('Nature of Enquiry', natureOfEnquiry)}
          ${tableRow('School of', schoolOf)}
          ${tableRow('Contact Method', contactMethod)}
          ${tableRow('Preferred Contact Time', preferredContactTime)}
          ${message ? tableRow('Message', message) : ''}
        </table>
      `

      textContent = `
Name: ${firstName} ${surname}
Email: ${email}
Phone: ${cellphoneNumber}
Alternative Contact Number: ${alternativeContactNumber || 'Not provided'}
Nature of Enquiry: ${natureOfEnquiry || 'Not provided'}
School of: ${schoolOf || 'Not provided'}
Contact Method: ${contactMethod || 'Not provided'}
Preferred Contact Time: ${preferredContactTime || 'Not provided'}
Message:
${message || 'None'}
      `
    }

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      replyTo: data.email || undefined,
      subject,
      text: textContent,
      html: htmlContent,
    })

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(JSON.stringify({ error: 'Error sending email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
