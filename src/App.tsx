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
    console.log('todos: ', todos)
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (newTodo: Todo) => {
    setTodos([newTodo, ...todos]);
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const moveTodo = (id: number, status: Status) => {
    setTodos((prevs) => prevs.map((todo) => (todo.id === id ? { ...todo, status } : todo)));
  };

  const filteredTodos = (status: Status) =>
    todos.filter((todo) => todo.status === status);

  return (
    <Layout>
      <Header className="bg-blue-6">
        <h1 className="text-white">Todo List Application</h1>
      </Header>
      <Content className="p-3">
        <Row gutter={16}>
          {Object.values(Statuses).map((status) => (
            <DndProvider backend={HTML5Backend}>
              <Column
                key={status}
                status={status}
                todos={filteredTodos(status)}
                onMoveTodo={moveTodo}
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
