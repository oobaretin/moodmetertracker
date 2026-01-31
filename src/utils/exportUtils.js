/**
 * Export utilities for CSV and JSON
 */

/**
 * Export mood entries to CSV
 * @param {Array} entries - Mood entries
 */
export function exportToCSV(entries) {
  if (entries.length === 0) {
    alert('No entries to export');
    return;
  }
  
  const headers = ['Timestamp', 'Energy', 'Pleasantness', 'Quadrant', 'Note', 'Activities'];
  const rows = entries.map(entry => [
    entry.timestamp,
    entry.energy,
    entry.pleasantness,
    entry.quadrant,
    `"${(entry.note || '').replace(/"/g, '""')}"`,
    (entry.activities || []).join('; '),
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `mood-entries-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export mood entries to JSON
 * @param {Array} entries - Mood entries
 */
export function exportToJSON(entries) {
  if (entries.length === 0) {
    alert('No entries to export');
    return;
  }
  
  const data = {
    exportDate: new Date().toISOString(),
    entries: entries,
  };
  
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `mood-entries-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Import mood entries from JSON
 * @param {File} file - JSON file
 * @returns {Promise<Array>} Parsed entries
 */
export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const entries = data.entries || data;
        
        if (!Array.isArray(entries)) {
          reject(new Error('Invalid file format'));
          return;
        }
        
        resolve(entries);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}




