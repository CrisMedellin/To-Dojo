import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import KatanasImage from './images/Katanas.png';
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
  const [newTaskColor, setNewTaskColor] = useState('#ffffff'); // Default color
  const [editTaskColor, setEditTaskColor] = useState('#ffffff');

  const pastelColors = [
    { name: 'Blanco', value: '#ffffff' },
    { name: 'Rojo cereza', value: '#ffc1c1' },
    { name: 'Azul real', value: '#c1d4ff' },
    { name: 'Verde esmeralda', value: '#c1ffc1' },
    { name: 'Naranja terracota', value: '#ffd7c1' },
    { name: 'Púrpura berenjena', value: '#d4c1ff' },
    { name: 'Turquesa', value: '#c1ffff' },
    { name: 'Amarillo mostaza', value: '#fff5c1' },
    { name: 'Coral', value: '#ffd1c1' },
    { name: 'Negro carbón', value: '#c4c4c4' },
    { name: 'Gris acero', value: '#e0e0e0' }
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskFile(null); // Reiniciar el archivo
    setNewTaskColor('#ffffff'); // Reset color
  };

  const openEditModal = (index) => {
    const taskToEdit = tasks[index];
    setEditTaskIndex(index);
    setEditTaskTitle(taskToEdit.title);
    setEditTaskDescription(taskToEdit.description);
    setEditTaskFile(taskToEdit.file);
    setEditTaskColor(taskToEdit.color || '#ffffff');
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditTaskIndex(null);
    setEditTaskTitle('');
    setEditTaskDescription('');
    setEditTaskFile(null);
    setEditTaskColor('#ffffff'); // Reset color
  };
  
  const saveTaskEdits = () => {
    if (editTaskTitle && editTaskDescription) {
      const updatedTasks = [...tasks];
      updatedTasks[editTaskIndex] = {
        title: editTaskTitle,
        description: editTaskDescription,
        file: editTaskFile,
        color: editTaskColor || '#ffffff'
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
        color: newTaskColor || '#ffffff'
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
          <div className="task-card" key={index} style={{ backgroundColor: task.color || '#ffffff' }}>
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
      <img src={KatanasImage} alt="Agregar tarea" className="add-task-icon" />
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
            <div className="color-picker">
              <label>Selecciona un color:</label>
              <div className="color-options">
                {pastelColors.map((color) => (
                  <button key={color.name} style={{ backgroundColor: color.value }} className={`color-btn ${newTaskColor === color.value ? 'selected' : ''}`} onClick={() => setNewTaskColor(color.value)} />
                ))}
              </div>
            </div>
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
            <div className="color-picker">
              <label>Selecciona un color:</label>
              <div className="color-options">
                {pastelColors.map((color) => (
                  <button key={color.name} style={{ backgroundColor: color.value }} className={`color-btn ${editTaskColor === color.value ? 'selected' : ''}`} onClick={() => setEditTaskColor(color.value)} />
                ))}
              </div>
            </div>
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
