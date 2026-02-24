
export const githubService = {
    updateNotes: async (token: string, owner: string, repo: string, path: string, content: any, message: string) => {
        const baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

        // 1. Get current file data to get the SHA
        const getResponse = await fetch(baseUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!getResponse.ok) {
            throw new Error(`Failed to fetch file info: ${getResponse.statusText}`);
        }

        const fileData = await getResponse.json();
        const sha = fileData.sha;

        // 2. Prepare content
        const jsonContent = JSON.stringify(content, null, 4);
        const encodedContent = btoa(unescape(encodeURIComponent(jsonContent)));

        // 3. Update file
        const updateResponse = await fetch(baseUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                content: encodedContent,
                sha
            })
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`Failed to update file: ${errorData.message || updateResponse.statusText}`);
        }

        return await updateResponse.json();
    }
};
