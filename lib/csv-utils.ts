/**
 * Converts an array of objects into a CSV string.
 * @param data Array of objects to convert.
 * @param headers Optional array of header names. If not provided, keys of the first object are used.
 * @returns A CSV formatted string.
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (!data || data.length === 0) {
    return headers ? headers.join(',') + '\n' : '';
  }

  const columnHeaders = headers || Object.keys(data[0]);
  const columnKeys = Object.keys(data[0]);

  const csvRows = [
    columnHeaders.join(','), // Header row
    ...data.map((row) =>
      columnKeys
        .map((key) => {
          const value = row[key];
          const stringValue =
            value === null || value === undefined
              ? ''
              : typeof value === 'object'
              ? JSON.stringify(value).replace(/"/g, '""')
              : String(value).replace(/"/g, '""');
          
          return `"${stringValue}"`;
        })
        .join(',')
    ),
  ];

  return csvRows.join('\n');
}
