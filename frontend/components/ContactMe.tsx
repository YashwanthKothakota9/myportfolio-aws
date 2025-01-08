import Link from 'next/link';
import ViewersCount from './ViewersCount';

// import dynamic from 'next/dynamic';

// const ViewersCount = dynamic(() => import('./ViewersCount'), { ssr: false });

const ContactMe = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Contact Me</h1>
      <p className="text-base text-gray-700 dark:text-gray-300">
        Want to chat? Just dm on{' '}
        <Link className="text-green-500" href="https://x.com/Yashcsp22">
          Twitter
        </Link>{' '}
        or email me directly at
        <Link
          className="text-green-500"
          href="mailto:yashwanthkothakota@gmail.com"
        >
          {' '}
          yashwanthkothakota@gmail.com
        </Link>
        <div className="flex flex-row gap-2 items-center justify-center pt-2">
          <ViewersCount />
        </div>
      </p>
    </div>
  );
};

export default ContactMe;
