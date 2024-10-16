
const InvalidTable = ({ data }) => {
  return (
    <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
      <thead>
        <tr className="bg-red-200 text-gray-600 text-left">
          <th className="py-2 px-4">Username</th>
          <th className="py-2 px-4">Repository</th>
          <th className="py-2 px-4">Error Message</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ username, repo, error }, index) => (
          <tr key={`${username}-${repo}-${index}`} className="border-b">
            <td className="py-2 px-4">{username}</td>
            <td className="py-2 px-4">{repo}</td>
            <td className="py-2 px-4 text-red-500">{error}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InvalidTable;
