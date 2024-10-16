import  { useEffect, useState } from 'react';
import ValidTable from './ValidTable';
import InvalidTable from './InvalidTable';
import * as XLSX from 'xlsx';

const App = () => {
  const token = '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'; // GitHub token

  // List of users and their repositories
  const usersRepos = [
    { username: 'Kuroo7', repo: 'real-estate' },
    { username: 'octocat', repo: 'Hello-World' },
    { username: 'nonExistentUser', repo: 'fakeRepo' },
    { username: 'wrongUser', repo: 'wrongRepo' },
  ];

  const [validData, setValidData] = useState([]);
  const [invalidData, setInvalidData] = useState([]);

  useEffect(() => {
    const fetchCommitsForAll = async () => {
      const validResults = [];
      const invalidResults = [];

      for (const { username, repo } of usersRepos) {
        try {
          const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits`, {
            headers: {
              Authorization: `token ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch ${username}/${repo}: ${response.statusText} (Status: ${response.status})`);
          }

          const commits = await response.json();
          validResults.push({ username, repo, commits });
        } catch (error) {
          invalidResults.push({ username, repo, error: error.message });
        }
      }

      setValidData(validResults);
      setInvalidData(invalidResults);
    };

    fetchCommitsForAll();
  }, []);

  // Function to download the data in Excel format
  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();

    // Prepare valid data
    const validSheetData = [];
    validData.forEach(({ username, repo, commits }) => {
      commits.forEach((commit) => {
        validSheetData.push({
          Username: username,
          Repository: repo,
          'Commit Message': commit.commit.message,
          'Commit Date': new Date(commit.commit.committer.date).toLocaleString(),
        });
      });
    });
    const validWS = XLSX.utils.json_to_sheet(validSheetData);
    XLSX.utils.book_append_sheet(wb, validWS, 'Valid Repositories');

    // Prepare invalid data
    const invalidSheetData = invalidData.map(({ username, repo, error }) => ({
      Username: username,
      Repository: repo,
      'Error Message': error,
    }));
    const invalidWS = XLSX.utils.json_to_sheet(invalidSheetData);
    XLSX.utils.book_append_sheet(wb, invalidWS, 'Invalid Repositories');

    // Write Excel file and trigger download
    XLSX.writeFile(wb, 'GitHub_Commits_Data.xlsx');
  };

  return (
    <div className="bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">GitHub Commits Viewer</h1>

      {/* Download Button */}
      <button
        onClick={downloadExcel}
        className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Download Excel
      </button>

      {/* Valid Commits Table */}
      <h2 className="text-2xl font-semibold mb-4">Valid Repositories</h2>
      <ValidTable data={validData} />

      {/* Invalid Repositories Table */}
      <h2 className="text-2xl font-semibold mb-4 text-red-500">Invalid Repositories or Usernames</h2>
      <InvalidTable data={invalidData} />
    </div>
  );
};

export default App;
