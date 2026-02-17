'use client'
import Script from 'next/script'

const reportingUrl = process.env.NEXT_PUBLIC_INSTANA_REPORTING_URL
const key = process.env.NEXT_PUBLIC_INSTANA_KEY
const src = process.env.NEXT_PUBLIC_INSTANA_EUM_SRC
const integrity = process.env.NEXT_PUBLIC_INSTANA_EUM_INTEGRITY

/* eslint-disable @next/next/no-before-interactive-script-outside-document */
export function InstanaEum() {
  if (!reportingUrl || !key || !src) return null

  return (
    <>
      <Script id='instana-eum-bootstrap' strategy='beforeInteractive'>
        {`(function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");
          ineum('reportingUrl',${JSON.stringify(reportingUrl)});
          ineum('key',${JSON.stringify(key)});
          ineum('trackSessions');`}
      </Script>
      <Script
        id='instana-eum'
        strategy='beforeInteractive'
        defer
        crossOrigin='anonymous'
        src={src}
        integrity={integrity}
      />
    </>
  )
}
