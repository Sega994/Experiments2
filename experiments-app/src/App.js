import React, { useState, useEffect } from 'react';

function App() {
  // Загружаем данные из localStorage при запуске
 const [experiments, setExperiments] = useState(() => {
  const saved = localStorage.getItem('experiments');
  if (saved) return JSON.parse(saved);
  // Начальные примеры
  return [
    { id: 1, name: 'Испытание двигателя', status: 'План' },
    { id: 2, name: 'Тест химической реакции', status: 'В процессе' },
    { id: 3, name: 'Анализ образцов', status: 'Завершён' },
  ];
});

  const [statusFilter, setStatusFilter] = useState('Все');
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('План');

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('experiments', JSON.stringify(experiments));
  }, [experiments]);

  // Добавить эксперимент
  const addExperiment = () => {
    if (newName.trim() === '') {
      alert('Введите название эксперимента');
      return;
    }
    const newExperiment = {
      id: Date.now(),
      name: newName,
      status: newStatus,
    };
    setExperiments([...experiments, newExperiment]);
    setNewName('');
    setNewStatus('План');
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

  // Фильтрация
  const filteredExperiments = statusFilter === 'Все'
    ? experiments
    : experiments.filter(exp => exp.status === statusFilter);

  // Подсчёт завершённых
  const completedCount = experiments.filter(exp => exp.status === 'Завершён').length;

  // Варианты статусов
  const statuses = ['План', 'В процессе', 'Завершён'];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>🧪 Учёт экспериментов</h1>

      {/* Счётчик завершённых */}
      <div style={{ background: '#d4edda', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
        ✅ Завершённых экспериментов: <strong>{completedCount}</strong>
      </div>

      {/* Форма добавления */}
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: '#e9ecef' }}>
        <h3>➕ Новый эксперимент</h3>
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
          <button
            onClick={addExperiment}
            style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Добавить
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
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
              </div>
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
                Удалить
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;