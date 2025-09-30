
import { ProjectCard } from "@/components/public/project-card"; // Corrected import path
import { getProjects } from "@/lib/data";

// This forces the page to be rendered dynamically and always fetch the latest data.
export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
