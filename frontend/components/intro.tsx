'use client';

import Image from 'next/image';

const Intro = () => {
  return (
    <div className="flex gap-4 flex-col-reverse sm:flex-row items-center justify-center">
      <div className="flex flex-col gap-4 md:w-9/12 sm:w-full">
        <h1 className="text-4xl font-bold">Hi! I am Yashwanth</h1>
        <p className="text-base text-gray-700 dark:text-gray-300">
          I am a 2023 Post graduate in Computer Science from BITS Pilani. I have
          an internship experience as a Software Engineer in Western Digital. I
          am a Cloud Engineer with an experience in developing and architecting
          projects using AWS resources. I passed my AWS Solutions architect
          associate certificate (SAA-C03).
        </p>
      </div>
      <div className="md:w-3/12 sm:w-full flex-1">
        <Image
          src={'/images/yashwanth.jpeg'}
          alt="Yashwanth"
          width={100}
          height={100}
          className="rounded-md border border-gray-100 h-36 w-36 object-cover"
          unoptimized
        />
      </div>
    </div>
  );
};

export default Intro;
