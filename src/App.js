import React, { useState, useEffect } from 'react';
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
  const userId = "RPC"; // Usuario predeterminado

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

  const API_URL = "https://esppb5i6ui.execute-api.us-east-1.amazonaws.com/dev"; // Reemplaza <tu-api-id> con tu ID de API Gateway

  // Obtener todas las tareas al cargar la aplicación
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks?userId=${userId}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };
    fetchTasks();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskFile(null);
    setNewTaskColor('#ffffff');
  };

  const openEditModal = (index) => {
    const taskToEdit = tasks[index];
    setEditTaskIndex(index);
    setEditTaskTitle(taskToEdit.title);
    setEditTaskDescription(taskToEdit.description);
    setEditTaskFile(null);
    setEditTaskColor(taskToEdit.color || '#ffffff');
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditTaskIndex(null);
    setEditTaskTitle('');
    setEditTaskDescription('');
    setEditTaskFile(null);
    setEditTaskColor('#ffffff');
  };

  // Crear tarea nueva
  const createTask = async () => {
    if (!newTaskTitle || !newTaskDescription) {
        alert("Por favor, completa el título y la descripción.");
        return;
    }

    const taskId = `task-${Date.now()}`;

    // Convertir el archivo en base64 si existe
    let fileBase64 = null;
    if (newTaskFile) {
        fileBase64 = await convertFileToBase64(newTaskFile);
    }

    // Crear el objeto de datos de la tarea
    const taskData = {
        userId: "user123",
        taskId,
        title: newTaskTitle,
        description: newTaskDescription,
        color: newTaskColor,
        fileName: newTaskFile ? newTaskFile.name : null,
        fileContent: fileBase64 // Archivo en base64
    };

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            throw new Error(`Error en la creación de tarea: ${response.statusText}`);
        }

        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, { ...taskData, fileUrl: newTask.fileUrl }]);
        closeModal();
    } catch (error) {
        console.error("Error al crear la tarea:", error);
    }
  };


  // Eliminar tarea
  const deleteTask = async (index) => {
    const taskToDelete = tasks[index];
    try {
      await fetch(`${API_URL}/tasks`, {
        method: "DELETE",
        body: JSON.stringify({ userId, taskId: taskToDelete.taskId }),
        headers: { "Content-Type": "application/json" },
      });
      setTasks(tasks.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const saveTaskEdits = async () => {
    const taskToUpdate = tasks[editTaskIndex];
   
    // Convertir el archivo en base64 si existe
    let fileBase64 = null;
    if (editTaskFile) {
        fileBase64 = await convertFileToBase64(editTaskFile);
    }

    // Crear el objeto de datos de la tarea
    const updatedTask = {
        userId,
        taskId: taskToUpdate.taskId,
        title: editTaskTitle,
        description: editTaskDescription,
        color: editTaskColor,
        fileName: editTaskFile ? editTaskFile.name : null,
        fileContent: fileBase64 // Archivo en base64 si existe
    };

    try {
        // Enviar la solicitud PUT con los datos en formato JSON
        const response = await fetch(`${API_URL}/tasks`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask), // Enviar como JSON
        });

        if (!response.ok) {
            throw new Error(`Error en la actualización de tarea: ${response.statusText}`);
        }

        const data = await response.json();
       
        // Actualizar el estado local de tareas
        const updatedTasks = [...tasks];
        updatedTasks[editTaskIndex] = {
            ...taskToUpdate,
            title: editTaskTitle,
            description: editTaskDescription,
            color: editTaskColor,
            fileUrl: data.fileUrl // Actualiza la URL del archivo si fue cambiada
        };
       
        setTasks(updatedTasks);
        closeEditModal();
    } catch (error) {
        console.error("Error al actualizar la tarea:", error);
    }
  };


  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="App">
      <h1 className="title">To-Dojo</h1>
      <div className="task-list">
        {tasks.map((task, index) => (
          <div className="task-card" key={task.taskId} style={{ backgroundColor: task.color || '#ffffff' }}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            {task.fileUrl && (
              <a href={task.fileUrl} target="_blank" rel="noopener noreferrer">
                Ver archivo adjunto
              </a>
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
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nueva Tarea</h2>
            <input type="text" placeholder="Título" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
            <textarea placeholder="Descripción" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} />
            <input type="file" onChange={(e) => setNewTaskFile(e.target.files[0])} />
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
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Tarea</h2>
            <input type="text" placeholder="Título" value={editTaskTitle} onChange={(e) => setEditTaskTitle(e.target.value)} />
            <textarea placeholder="Descripción" value={editTaskDescription} onChange={(e) => setEditTaskDescription(e.target.value)} />
            <input type="file" onChange={(e) => setEditTaskFile(e.target.files[0])} />
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
