import React, { useState, useEffect } from 'react';

function App() {
  // Загружаем данные из localStorage при запуске
  const [experiments, setExperiments] = useState(() => {
    const saved = localStorage.getItem('experiments');
    if (saved) return JSON.parse(saved);
    // Начальные примеры
    return [
      { id: 1, name: 'Испытание двигателя', status: 'План', file: null, fileName: null },
      { id: 2, name: 'Тест химической реакции', status: 'В процессе', file: null, fileName: null },
      { id: 3, name: 'Анализ образцов', status: 'Завершён', file: null, fileName: null },
    ];
  });

  const [statusFilter, setStatusFilter] = useState('Все');
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('План');
  const [newFile, setNewFile] = useState(null);
  const [newFileName, setNewFileName] = useState(null);

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('experiments', JSON.stringify(experiments));
  }, [experiments]);

  // Конвертация файла в base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Добавить эксперимент
  const addExperiment = async () => {
    if (newName.trim() === '') {
      alert('Введите название эксперимента');
      return;
    }
    
    let fileData = null;
    let fileName = null;
    
    if (newFile) {
      fileData = await fileToBase64(newFile);
      fileName = newFileName;
    }
    
    const newExperiment = {
      id: Date.now(),
      name: newName,
      status: newStatus,
      file: fileData,
      fileName: fileName,
    };
    setExperiments([...experiments, newExperiment]);
    setNewName('');
    setNewStatus('План');
    setNewFile(null);
    setNewFileName(null);
    
    // Сбрасываем input файла
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
  };

  // Удалить эксперимент
  const deleteExperiment = (id) => {
    setExperiments(experiments.filter(exp => exp.id !== id));
  };

  // Изменить статус
  const updateStatus = (id, newStatus) => {
    setExperiments(experiments.map(exp =>
      exp.id === id ? { ...exp, status: newStatus } : exp
    ));
  };

  // Прикрепить файл к существующему эксперименту
  const attachFile = async (id, file, fileName) => {
    const fileData = await fileToBase64(file);
    setExperiments(experiments.map(exp =>
      exp.id === id ? { ...exp, file: fileData, fileName: fileName } : exp
    ));
  };

  // Удалить файл из эксперимента
  const removeFile = (id) => {
    setExperiments(experiments.map(exp =>
      exp.id === id ? { ...exp, file: null, fileName: null } : exp
    ));
  };

  // Скачать файл
  const downloadFile = (fileData, fileName) => {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    link.click();
  };

  // Фильтрация
  const filteredExperiments = statusFilter === 'Все'
    ? experiments
    : experiments.filter(exp => exp.status === statusFilter);

  // Подсчёт завершённых
  const completedCount = experiments.filter(exp => exp.status === 'Завершён').length;

  // Варианты статусов
  const statuses = ['План', 'В процессе', 'Завершён'];

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1>🧪 Учёт экспериментов</h1>

      {/* Счётчик завершённых */}
      <div style={{ background: '#d4edda', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
        ✅ Завершённых экспериментов: <strong>{completedCount}</strong>
      </div>

      {/* Форма добавления */}
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: '#e9ecef' }}>
        <h3>➕ Новый эксперимент</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              placeholder="Название эксперимента"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ flex: 2, padding: '8px' }}
            />
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{ padding: '8px' }}
            >
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          
          {/* Прикрепление файла при создании */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ backgroundColor: '#6c757d', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
              📎 Выбрать файл
              <input
                id="fileInput"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setNewFile(e.target.files[0]);
                    setNewFileName(e.target.files[0].name);
                  }
                }}
              />
            </label>
            {newFileName && (
              <span style={{ fontSize: '14px', color: '#666' }}>
                📄 {newFileName}
                <button
                  onClick={() => {
                    setNewFile(null);
                    setNewFileName(null);
                    const fileInput = document.getElementById('fileInput');
                    if (fileInput) fileInput.value = '';
                  }}
                  style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                >
                  ✖
                </button>
              </span>
            )}
          </div>
          
          <button
            onClick={addExperiment}
            style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Добавить эксперимент
          </button>
        </div>
      </div>

      {/* Фильтр по статусу */}
      <div style={{ marginBottom: '20px' }}>
        <label>Фильтр по статусу: </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '5px', marginLeft: '10px' }}
        >
          <option>Все</option>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Список экспериментов */}
      {filteredExperiments.length === 0 ? (
        <p>Нет экспериментов</p>
      ) : (
        filteredExperiments.map(exp => (
          <div
            key={exp.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '10px',
              background: 'white'
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{exp.name}</h3>
              <p style={{ margin: 0 }}>
                Статус:{' '}
                <select
                  value={exp.status}
                  onChange={(e) => updateStatus(exp.id, e.target.value)}
                  style={{
                    marginLeft: '5px',
                    padding: '3px',
                    backgroundColor: 
                      exp.status === 'Завершён' ? '#d4edda' :
                      exp.status === 'В процессе' ? '#fff3cd' : '#f8d7da'
                  }}
                >
                  {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
              </p>
              
              {/* Файл */}
              {exp.file ? (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '5px' }}>
                  <span>📎 {exp.fileName}</span>
                  <button
                    onClick={() => downloadFile(exp.file, exp.fileName)}
                    style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '3px 10px', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    ⬇ Скачать
                  </button>
                  <button
                    onClick={() => removeFile(exp.id)}
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '3px 10px', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    ✖ Удалить файл
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: '10px' }}>
                  <label style={{ backgroundColor: '#6c757d', color: 'white', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                    📎 Прикрепить файл
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        if (e.target.files[0]) {
                          await attachFile(exp.id, e.target.files[0], e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                onClick={() => deleteExperiment(exp.id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Удалить эксперимент
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;