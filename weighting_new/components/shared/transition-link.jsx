'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { usePageTransition } from '@/components/providers/page-transition-provider'

function isModifiedEvent(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
}

function isBypassHref(href) {
  return (
    typeof href !== 'string' ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('http://') ||
    href.startsWith('https://')
  )
}

export default function TransitionLink({ href, onClick, children, ...props }) {
  const router = useRouter()
  const pathname = usePathname()
  const { startTransition } = usePageTransition()

  function handleClick(event) {
    onClick?.(event)

    if (event.defaultPrevented || isModifiedEvent(event) || isBypassHref(href)) {
      return
    }

    if (typeof href === 'string' && href === pathname) {
      return
    }

    event.preventDefault()
    startTransition(() => router.push(href))
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
