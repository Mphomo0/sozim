import React from 'react'

export function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
  footer,
}: {
  title: string
  description: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>

        <div className="mt-4">{children}</div>

        {footer && <div className="mt-6 border-t pt-4">{footer}</div>}
      </div>
    </div>
  )
}
