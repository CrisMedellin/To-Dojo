import React, { useState } from 'react';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const createTask = () => {
    if (newTaskTitle && newTaskDescription) {
      const newTask = {
        title: newTaskTitle,
        description: newTaskDescription,
      };
      setTasks([...tasks, newTask]); // Agrega la nueva tarea a la lista
      closeModal();
    } else {
      alert("Por favor, completa el título y la descripción.");
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((task, taskIndex) => taskIndex !== index);
    setTasks(updatedTasks); // Elimina la tarea seleccionada
  };

  return (
    <div className="App">
      <h1 className="title">Lista de Tareas</h1>

      {/* Mostrar tarjetas de tareas */}
      <div className="task-list">
        {tasks.map((task, index) => (
          <div className="task-card" key={index}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <button onClick={() => deleteTask(index)} className="delete-btn">
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {/* Botón flotante */}
      <button className="add-task-btn" onClick={openModal}>
        +
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nueva Tarea</h2>
            <input
              type="text"
              placeholder="Título"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <textarea
              placeholder="Descripción"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={createTask} className="create-btn">Crear</button>
              <button onClick={closeModal} className="close-btn">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
