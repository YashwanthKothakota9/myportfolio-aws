import Link from 'next/link';
import { Button } from './ui/button';

interface Project {
  title: string;
  description: string;
  link: string;
  code: string;
  previewPhoto: string;
  technologies: string[];
}

const projectsData: Project[] = [
  {
    title: '',
    description: '',
    link: '',
    code: '',
    previewPhoto: '',
    technologies: [''],
  },
];

const Projects = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Projects</h1>
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
        {projectsData?.map((item, index) => (
          <div
            key={index}
            className="flex flex-col border border-gray-100 dark:border-gray-800  rounded-md"
          >
            <video
              src={item.previewPhoto}
              autoPlay
              muted
              className="w-full h-full rounded-t-md"
            />
            <div className="flex flex-col gap-3 p-4">
              <h2 className="text-lg font-bold">{item.title}</h2>
              <p className="text-base text-gray-500">{item.description}</p>
              <div className="flex gap-1 flex-wrap">
                {item.technologies.map((tech, index) => (
                  <div
                    key={index}
                    className="flex border border-gray-200 rounded-md px-2 py-1 text-sm bg-gray-200 text-gray-800"
                  >
                    {tech}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Link href={item.link}>
                  <Button variant={'default'}>View</Button>
                </Link>
                <Link href={item.code}>
                  <Button variant={'outline'}>Code</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
