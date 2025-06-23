import React, { useState } from 'react';
import { Layout, Row, Col } from 'antd';
import TodoForm from './components/TodoForm';
import Column from './components/Column';
import type { Todo } from './types';
import { Statuses } from './types/status';

const { Header, Content } = Layout;

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddTodo = (newTodo: Todo) => {
    setTodos([newTodo, ...todos]);
  };
  const moveTodo = (id: string, status: Todo['status']) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, status } : todo
      )
    );
  };

  const filteredTodos = (status: Todo['status']) =>
    todos.filter((todo) => todo.status === status);

  return (
    <Layout>
      <Header className='bg-blue' onClick={showModal}>
        <h1 className='text-white'>Todo List Application</h1>
      </Header>
      <Content className='p-5'>
        <Row gutter={16}>
          <Col span={24}>
            <TodoForm
              onAddTodo={handleAddTodo}
              visible={isModalVisible}
              onCancel={handleCancel}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Column
            status={Statuses.PENDING}
            todos={filteredTodos(Statuses.PENDING)}
            onMoveTodo={moveTodo}
          />
          <Column
            status={Statuses.IN_PROGRESS}
            todos={filteredTodos(Statuses.IN_PROGRESS)}
            onMoveTodo={moveTodo}
          />
          <Column
            status={Statuses.COMPLETED}
            todos={filteredTodos(Statuses.COMPLETED)}
            onMoveTodo={moveTodo}
          />
        </Row>
      </Content>
    </Layout>
  );
};

export default App;
