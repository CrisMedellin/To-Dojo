import React, { useState } from 'react';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskFile, setNewTaskFile] = useState(null); // Nuevo estado para el archivo
  const [tasks, setTasks] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskFile(null); // Reiniciar el archivo
  };

  const createTask = () => {
    if (newTaskTitle && newTaskDescription) {
      const newTask = {
        title: newTaskTitle,
        description: newTaskDescription,
        file: newTaskFile,
      };
      setTasks([...tasks, newTask]);
      closeModal();
    } else {
      alert("Por favor, completa el título y la descripción.");
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((task, taskIndex) => taskIndex !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="App">
      <h1 className="title">Lista de Tareas</h1>

      <div className="task-list">
        {tasks.map((task, index) => (
          <div className="task-card" key={index}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            {task.file && (
              <div className="file-preview">
                {task.file.type.startsWith('image/') ? (
                  <a href={URL.createObjectURL(task.file)} target="_blank" rel="noopener noreferrer">
                    <img src={URL.createObjectURL(task.file)} alt="miniatura" className="thumbnail" />
                  </a>
                ) : (
                  <a 
                    href={URL.createObjectURL(task.file)} 
                    download={task.file.name} // Asegura que el archivo se descargue
                    rel="noopener noreferrer"
                  >
                    {task.file.name}
                  </a>
                )}
              </div>
            )}
            <button onClick={() => deleteTask(index)} className="delete-btn">
              Eliminar
            </button>
          </div>
        ))}
      </div>


      <button className="add-task-btn" onClick={openModal}>
        +
      </button>

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
            <input
              type="file"
              onChange={(e) => setNewTaskFile(e.target.files[0])} // Maneja el archivo
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
