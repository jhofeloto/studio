
import { mockProjects } from "./mock-data";
import { unstable_noStore as noStore } from 'next/cache';

export async function getProjects() {
  // This will prevent the data from being cached.
  noStore();
  return mockProjects;
}

export async function getProjectById(id: string) {
  // This will prevent the data from being cached.
  noStore();
  const project = mockProjects.find((p) => p.id === id);
  return project;
}
