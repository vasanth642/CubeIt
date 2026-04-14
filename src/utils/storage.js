const defaultState = {
  activeSessionId: "1",
  sessions: [
    {
      id: "1",
      name: "Main Session",
      solves: []
    }
  ]
};

export const loadData = () => {
  const data = localStorage.getItem('cubosapiens_data');
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return defaultState;
    }
  }
  return defaultState;
};

export const saveData = (data) => {
  localStorage.setItem('cubosapiens_data', JSON.stringify(data));
};

export const exportData = (data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cubosapiens_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
