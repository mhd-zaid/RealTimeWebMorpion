const NotFoundPage = () => {
  return (
    <div className='w-full h-full flex justify-center items-center pt-6 sm:pt-0'>
      <div className='w-full sm:w-2/3 md:w-1/2 lg:w-2/5 bg-white p-5 mx-auto rounded-2xl px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24'>
        <h2 className='mb-12 text-center text-3xl font-extrabold'>
          Page non trouvée
        </h2>
        <p className='text-center'>
          Désolé, la page que vous recherchez n&apos;existe pas.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
