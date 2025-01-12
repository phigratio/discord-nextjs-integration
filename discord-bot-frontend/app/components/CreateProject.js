// CreateProject.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [orgId, setOrgId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const orgName = process.env.NEXT_PUBLIC_GITHUB_ORG;

  // Fetch organization ID on component mount
  useEffect(() => {
    const fetchOrgId = async () => {
      const query = `
        query {
          organization(login: "${orgName}") {
            id
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

        const id = response.data.data?.organization?.id;
        if (!id) {
          throw new Error('Could not fetch organization ID');
        }

        setOrgId(id);
      } catch (error) {
        console.error('Error fetching organization ID:', error);
        toast.error(`Failed to initialize: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgId();
  }, [orgName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    if (!name) {
      toast.error('Project name is required.');
      setIsCreating(false);
      return;
    }

    if (!orgId) {
      toast.error('Organization not properly initialized.');
      setIsCreating(false);
      return;
    }

    // GraphQL mutation for creating a project
    const mutation = `
      mutation {
        createProjectV2(
          input: {
            ownerId: "${orgId}"
            title: "${name}"
          }
        ) {
          projectV2 {
            id
            title
            url
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

      const project = response.data.data.createProjectV2.projectV2;
      toast.success(`Project "${project.title}" created successfully!`);
      setName('');
      setBody('');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(`Failed to create project: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <p>Initializing...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Project Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter project name"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="body" className="block text-sm font-medium text-gray-700">
          Project Description:
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Enter project description"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={isCreating || !orgId}
        className={`px-4 py-2 rounded-md text-white ${
          isCreating || !orgId ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        } transition-colors`}
      >
        {isCreating ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
};

export default CreateProject;