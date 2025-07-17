type TProps = { title?: string; className?: string };

export default function TinyLoader({ title, className }: TProps) {
  return (
    <div className={`relative z-10 grid gap-5 text-center ${className}`}>
      <div className='relative'>
        <div className='size-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto' />
        <div
          className='absolute inset-0 size-10 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin mx-auto'
          style={{
            animationDirection: 'reverse',
            animationDuration: '1.5s'
          }}
        />
      </div>
      <h3 className='text-lg font-medium text-gray-900'>
        Hold on, loading {title}
      </h3>
      <div className='gap-4 flex justify-center'>
        <div className='size-3 bg-indigo-400 rounded-full animate-bounce' />
        <div
          style={{
            animationDelay: '0.1s'
          }}
          className='size-3 bg-purple-400 rounded-full animate-bounce'
        />
        <div
          style={{
            animationDelay: '0.2s'
          }}
          className='size-3 bg-pink-400 rounded-full animate-bounce'
        />
      </div>
    </div>
  );
}
