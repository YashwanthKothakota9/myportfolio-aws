interface EducationItem {
  startDate: string;
  endDate: string;
  collegeName: string;
  courseName: string;
  cgpa: string;
}

const EducationData: EducationItem[] = [
  {
    startDate: 'August 2021',
    endDate: 'August 2023',
    collegeName: 'Birla Institute of Technology and Science, Pilani',
    courseName: 'Master of Engineering in Computer Science',
    cgpa: '9.16/10',
  },
  {
    startDate: 'August 2016',
    endDate: 'March 2020',
    collegeName: 'Rajeev Gandhi Memorial College of Engineering and Technology',
    courseName: 'Bachelor of Technology in Computer Science',
    cgpa: '9.14/10',
  },
];

const Education = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Education</h1>
      <div className="p-1">
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          {EducationData.map((item, index) => (
            <li key={index} className="mb-10 ms-4">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {item.startDate} - {item.endDate}
              </time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.courseName} at {item.collegeName}
              </h3>
              <p className="text-base text-gray-700">CGPA: {item.cgpa}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Education;
