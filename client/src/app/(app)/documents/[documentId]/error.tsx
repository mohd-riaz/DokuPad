'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"

function Error() {
  const router = useRouter()
  useEffect(()=>{
    router.push('/documents')
  }, [router])
  return (
    <div>Redirecting...</div>
  )
}
export default Error