export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='flex items-center justify-between text-sm'>
      <div className='text-muted-foreground'>{label}</div>
      <div className='font-medium'>{value}</div>
    </div>
  )
}
