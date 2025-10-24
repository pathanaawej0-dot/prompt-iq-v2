'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import QuickMode from '@/components/dashboard/QuickMode'
import ProMode from '@/components/dashboard/ProMode'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function DashboardContent() {
  const searchParams = useSearchParams()
  const mode = searchParams?.get('mode') || 'quick'

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">AI Prompt Generator</h1>
      
      <Tabs defaultValue={mode} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="quick">Quick Mode</TabsTrigger>
          <TabsTrigger value="pro">Pro Mode</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quick">
          <QuickMode />
        </TabsContent>
        
        <TabsContent value="pro">
          <ProMode />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
