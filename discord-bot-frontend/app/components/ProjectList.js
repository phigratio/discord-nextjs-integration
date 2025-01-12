// ProjectList.js
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const orgName = process.env.NEXT_PUBLIC_GITHUB_ORG;

  useEffect(() => {
    const fetchProjects = async () => {
      // GraphQL query for fetching projects
      const query = `
        query {
          organization(login: "${orgName}") {
            projectsV2(first: 100) {
              nodes {
                id
                title
                url
                closed
                shortDescription
                number
              }
            }
          }
        }
      `;

      try {
        const response = await axios.post(
          'https://api.github.com/graphql',
          { query },
          {
            headers: {
              Authorization: `bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.errors) {
          throw new Error(response.data.errors[0].message);
        }

        const projectsData = response.data.data?.organization?.projectsV2?.nodes;
        
        if (!projectsData) {
          throw new Error('No projects data received from GitHub');
        }

        // Filter out any null entries and ensure all required fields exist
        const validProjects = projectsData.filter(project => 
          project && 
          project.id && 
          project.title
        );

        setProjects(validProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
        toast.error(`Failed to load projects: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [orgName]);

  const deleteProject = async (projectId) => {
    const mutation = `
      mutation {
        deleteProjectV2(
          input: { projectId: "${projectId}" }
        ) {
          projectV2 {
            id
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        'https://api.github.com/graphql',
        { query: mutation },
        {
          headers: {
            Authorization: `bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      setProjects(projects.filter(project => project.id !== projectId));
      toast.success('Project deleted successfully.');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(`Failed to delete project: ${error.message}`);
    }
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Organization Projects</h2>
      {!projects || projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map(project => (
            <li 
              key={project.id} 
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <a
                    href={project.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {project.title} {project.number ? `(#${project.number})` : ''}
                  </a>
                  {project.shortDescription && (
                    <p className="mt-2 text-gray-600">{project.shortDescription}</p>
                  )}
                  <p className="mt-1 text-sm">
                    Status: {
                      typeof project.closed !== 'undefined' 
                        ? (project.closed ? 'Closed' : 'Open')
                        : 'Unknown'
                    }
                  </p>
                </div>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;