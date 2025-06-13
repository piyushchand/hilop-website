import Button from '@/components/uiFramework/Button'

export default function NotFound() {
  return (
    <div className="h-[60vh] flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4 flex flex-col items-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button
          label="Return Home"
          link="/"
          variant="btn-primary"
          size="lg"
        />
      </div>
    </div>
  )
} 