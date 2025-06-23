import React, { useEffect } from 'react';
import { Layout, Row } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './components/Column';
import { Statuses } from './types/status';
import type { Status, Todo } from './types';

const { Header, Content } = Layout;

const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>(() => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (newTodo: Todo) => {
    setTodos([newTodo, ...todos]);
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: number, todo: Todo) => {
    console.log('todo to update: ', todo)
    setTodos((prevs) => prevs.map((prev) => (prev.id === id ? todo : prev)));
  };

  const filteredTodos = (status: Status) =>
    todos.filter((todo) => todo.status === status);

  return (
    <Layout>
      <Header className="bg-header">
        <h1 className="text-white">Todo List Application</h1>
      </Header>
      <Content>
        <Row gutter={16} className='content-row'>
          {Object.values(Statuses).map((status) => (
            <DndProvider backend={HTML5Backend} key={status}>
              <Column
                status={status}
                todos={filteredTodos(status)}
                onUpdateTodo={updateTodo}
                onAddTodo={handleAddTodo}
                onDeleteTodo={handleDeleteTodo}
              />
            </DndProvider>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default App;
