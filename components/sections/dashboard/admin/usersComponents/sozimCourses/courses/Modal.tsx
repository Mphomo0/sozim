'use client'

import React, { ReactNode } from 'react'

type ModalProps = {
  title: string
  description?: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
  footer,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      onClick={onClose} // close when clicking outside
    >
      <div
        className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>

        {/* Body */}
        <div className="mt-2">{children}</div>

        {/* Footer */}
        {footer && <div className="mt-6 border-t pt-4">{footer}</div>}
      </div>
    </div>
  )
}
