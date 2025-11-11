import React from 'react'

export default function Logo({ size = 56 }){
  const s = size
  return (
    <svg className="site-logo" width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Logo Marketplace Estudiantil">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="12" fill="url(#g1)" />
      <g transform="translate(12,12) scale(0.8)" fill="white">
        <path d="M18 2c-4.4 0-8 3.6-8 8 0 3.4 2.2 6.2 5.3 7.3L16 28l1.7-10.7C23.8 16.2 26 13.4 26 10c0-4.4-3.6-8-8-8z" opacity="0.95"/>
        <circle cx="20" cy="22" r="2.5" opacity="0.95"/>
      </g>
    </svg>
  )
}
