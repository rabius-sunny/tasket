type TProps = {
  title: string;
  subTitle: string;
};

export default function PageLoader({ title, subTitle }: TProps) {
  return (
    <div className='relative min-h-[calc(100vh-5rem)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex pt-24 lg:pt-0 lg:items-center justify-center overflow-hidden'>
      {/* Fancy gradient shapes */}
      <div className='absolute top-[-80px] left-[-80px] w-72 h-72 bg-gradient-to-tr from-indigo-300 via-purple-200 to-pink-200 opacity-60 rounded-full blur-sm z-0' />
      <div className='absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-gradient-to-br from-pink-200 via-indigo-100 to-blue-200 opacity-50 rounded-full blur-sm z-0' />
      <div className='absolute top-1/2 left-[-60px] w-40 h-40 bg-gradient-to-br from-purple-200 to-indigo-300 opacity-40 rounded-full blur-sm z-0' />
      <div className='absolute bottom-20 right-1/3 w-32 h-32 bg-gradient-to-tr from-blue-200 to-pink-100 opacity-30 rounded-full blur-sm z-0' />

      <div className='relative z-10 text-center'>
        <div className='relative'>
          <div className='w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6'></div>
          <div
            className='absolute inset-0 w-16 h-16 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin mx-auto'
            style={{
              animationDirection: 'reverse',
              animationDuration: '1.5s'
            }}
          ></div>
        </div>
        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
          Loading Your {title}
        </h3>
        <p className='text-gray-600'>
          Preparing your {subTitle} and organizing everything...
        </p>
        <div className='mt-8 flex justify-center'>
          <div className='size-12 rounded-full bg-transparent animate-bounce'>
            <div className='size-4 bg-indigo-400 rounded-full'></div>
          </div>
          <div
            className='size-12  rounded-full bg-transparent animate-bounce'
            style={{
              animationDelay: '0.1s'
            }}
          >
            <div className='size-4 bg-purple-400 rounded-full'></div>
          </div>
          <div
            className='size-12 bg-transparent rounded-full animate-bounce'
            style={{
              animationDelay: '0.2s'
            }}
          >
            <div className='size-4 bg-pink-400 rounded-full'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
