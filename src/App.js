import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskFile, setNewTaskFile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [editTaskFile, setEditTaskFile] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskFile(null); // Reiniciar el archivo
  };

  const openEditModal = (index) => {
    const taskToEdit = tasks[index];
    setEditTaskIndex(index);
    setEditTaskTitle(taskToEdit.title);
    setEditTaskDescription(taskToEdit.description);
    setEditTaskFile(taskToEdit.file);
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditTaskIndex(null);
    setEditTaskTitle('');
    setEditTaskDescription('');
    setEditTaskFile(null);
  };
  
  const saveTaskEdits = () => {
    if (editTaskTitle && editTaskDescription) {
      const updatedTasks = [...tasks];
      updatedTasks[editTaskIndex] = {
        title: editTaskTitle,
        description: editTaskDescription,
        file: editTaskFile,
      };
      setTasks(updatedTasks);
      closeEditModal();
    } else {
      alert("Por favor, completa el título y la descripción.");
    }
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
      <h1 className="title">To-Dojo</h1>
  
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
                    download={task.file.name}
                    rel="noopener noreferrer"
                  >
                    {task.file.name}
                  </a>
                )}
              </div>
            )}
            <button onClick={() => openEditModal(index)} className="edit-btn">
              <FontAwesomeIcon icon={faPen} />
            </button>
            <button onClick={() => deleteTask(index)} className="delete-btn">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ))}
      </div>
  
      <button className="add-task-btn" onClick={openModal}>
        +
      </button>
  
      {/* Modal de creación */}
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
              onChange={(e) => setNewTaskFile(e.target.files[0])}
            />
            <div className="modal-buttons">
              <button onClick={createTask} className="create-btn">Crear</button>
              <button onClick={closeModal} className="close-btn">Cerrar</button>
            </div>
          </div>
        </div>
      )}
  
      {/* Modal de edición */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Tarea</h2>
            <input
              type="text"
              placeholder="Título"
              value={editTaskTitle}
              onChange={(e) => setEditTaskTitle(e.target.value)}
            />
            <textarea
              placeholder="Descripción"
              value={editTaskDescription}
              onChange={(e) => setEditTaskDescription(e.target.value)}
            />
            <input
              type="file"
              onChange={(e) => setEditTaskFile(e.target.files[0])}
            />
            {editTaskFile && (
              <div className="file-info">
                <p>Archivo actual: {editTaskFile.name}</p>
                <button onClick={() => setEditTaskFile(null)} className="remove-file-btn">
                  Eliminar archivo
                </button>
              </div>
            )}
            <div className="modal-buttons">
              <button onClick={saveTaskEdits} className="save-btn">Guardar</button>
              <button onClick={closeEditModal} className="close-btn">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
}

export default App;
