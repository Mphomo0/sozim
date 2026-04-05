'use client'

import { Mail } from 'lucide-react'

interface EmailLinkProps {
  user?: string
  domain?: string
  className?: string
  children?: React.ReactNode
  showIcon?: boolean
}

export default function EmailLink({
  user = 'admin',
  domain = 'sozim.co.za',
  className = '',
  children,
  showIcon = false,
}: EmailLinkProps) {
  const email = `${user}@${domain}`
  const mailto = `mailto:${email}`

  return (
    <a
      href={mailto}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        window.location.href = mailto
      }}
    >
      {showIcon && <Mail className="h-4 w-4 inline mr-1" />}
      {children || email}
    </a>
  )
}
