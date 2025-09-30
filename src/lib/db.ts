
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import type { Project } from "./definitions";

export async function getProjects(): Promise<Project[]> {
  const projectsCol = collection(db, 'projects');
  const projectSnapshot = await getDocs(projectsCol);
  const projectList = projectSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamps to Dates if necessary
      plazo: data.plazo?.toDate ? data.plazo.toDate() : new Date(),
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    } as Project;
  });
  return projectList;
}
