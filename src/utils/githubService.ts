
export interface FileUpdate {
    path: string;
    content: unknown;
}

export const githubService = {
    /**
     * Updates multiple files in a single commit using the Git Trees API
     */
    updateMultipleFiles: async (token: string, owner: string, repo: string, files: FileUpdate[], message: string) => {
        const authHeader = {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };

        // 1. Get the latest commit SHA of the main branch (usually 'main' or 'master')
        const branchResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches/main`, { headers: authHeader });
        let branchData;
        if (!branchResponse.ok) {
            // Try 'master' if 'main' fails
            const masterResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches/master`, { headers: authHeader });
            if (!masterResponse.ok) throw new Error('Failed to fetch branch info');
            branchData = await masterResponse.json();
        } else {
            branchData = await branchResponse.json();
        }

        const latestCommitSha = branchData.commit.sha;
        const baseTreeSha = branchData.commit.commit.tree.sha;

        // 2. Create blobs for each file
        const treeItems = await Promise.all(files.map(async (file) => {
            const jsonContent = JSON.stringify(file.content, null, 4);
            const blobResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
                method: 'POST',
                headers: authHeader,
                body: JSON.stringify({
                    content: btoa(unescape(encodeURIComponent(jsonContent))),
                    encoding: 'base64'
                })
            });
            if (!blobResponse.ok) throw new Error(`Failed to create blob for ${file.path}`);
            const blobData = await blobResponse.json();
            return {
                path: file.path,
                mode: '100644',
                type: 'blob',
                sha: blobData.sha
            };
        }));

        // 3. Create a new tree
        const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({
                base_tree: baseTreeSha,
                tree: treeItems
            })
        });
        if (!treeResponse.ok) throw new Error('Failed to create tree');
        const treeData = await treeResponse.json();

        // 4. Create a new commit
        const commitResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({
                message,
                tree: treeData.sha,
                parents: [latestCommitSha]
            })
        });
        if (!commitResponse.ok) throw new Error('Failed to create commit');
        const commitData = await commitResponse.json();

        // 5. Update the reference
        const refResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branchData.name}`, {
            method: 'PATCH',
            headers: authHeader,
            body: JSON.stringify({
                sha: commitData.sha
            })
        });
        if (!refResponse.ok) throw new Error('Failed to update reference');

        return await refResponse.json();
    },

    // Kept for backward compatibility if needed, but redirects to multi-file logic
    updateNotes: async (token: string, owner: string, repo: string, path: string, content: unknown, message: string) => {
        return githubService.updateMultipleFiles(token, owner, repo, [{ path, content }], message);
    }
};
