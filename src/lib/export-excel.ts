import * as xlsx from 'xlsx';

export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: keyof T; label: string }[],
  filename: string,
  sheetName: string = 'Sheet1'
) {
  // Map the raw data to an array of objects with the display labels as keys
  const exportData = data.map((row) => {
    const formattedRow: Record<string, any> = {};
    columns.forEach((col) => {
      formattedRow[col.label] = row[col.key];
    });
    return formattedRow;
  });

  // Create a new workbook and add the worksheet
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(exportData);

  // Append the worksheet to the workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate an excel file and trigger the download
  xlsx.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
