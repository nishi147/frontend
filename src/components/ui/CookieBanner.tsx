'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from './Button'
import Cookies from 'js-cookie'
import { X } from 'lucide-react'

export function CookieBanner() {
  const pathname = usePathname()
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = Cookies.get('ruzann-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    Cookies.set('ruzann-consent', 'accepted', { expires: 365 })
    setShowBanner(false)
  }

  const handleDecline = () => {
    Cookies.set('ruzann-consent', 'declined', { expires: 365 })
    setShowBanner(false)
  }

  if (pathname?.startsWith('/aiventurelab')) return null
  if (!showBanner) return null

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[5000] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary-500" />
        
        <button 
          onClick={handleDecline}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍪</span>
            <h3 className="text-lg font-black text-slate-800">Cookie Magic</h3>
          </div>
          
          <p className="text-sm font-bold text-slate-600 leading-relaxed">
            We use cookies to make your learning experience more magical and understand how you play & learn on Ruzann!
          </p>

          <div className="flex gap-3">
            <Button 
               onClick={handleAccept}
               className="flex-1 py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-black text-sm shadow-lg shadow-primary-200"
            >
              Accept All
            </Button>
            <Button 
               onClick={handleDecline}
               variant="outline"
               className="flex-1 py-3 rounded-2xl border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50"
            >
              Essential Only
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
