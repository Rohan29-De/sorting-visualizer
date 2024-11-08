import SortingVisualizer from '@/sorting-visualizer/components/SortingVisualizer.tsx'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SortingVisualizer />
    </main>
  )
}