const skillsData: string[] = [
  'AWS',
  'Docker',
  'Kubernetes',
  'Terraform',
  'Jenkins',
  'Git',
  'Github',
  'Linux',
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'PostgreSQL',
];

const Skills = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Skills</h1>
      <div className="flex flex-wrap gap-2">
        {skillsData.map((item, index) => (
          <div
            key={index}
            className="flex border border-gray-200 dark:border-gary-800 rounded-md px-2 py-1 text-sm bg-gray-500 text-white"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
