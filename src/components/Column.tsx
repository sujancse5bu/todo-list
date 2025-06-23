import React, { useState } from 'react';
import { Button, Card, Col } from 'antd';
import {
  PlusOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm'; // Assuming TodoForm is here
import type { Status, Todo } from '../types';
import { Statuses } from '../types/status';

const { PENDING, IN_PROGRESS, COMPLETED } = Statuses;

interface ColumnProps {
  status: Status;
  todos: Todo[];
  onMoveTodo: (id: string, status: Status) => void;
  onAddTodo: (newTodo: Todo) => void;
  onDeleteTodo: (id: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  status,
  todos,
  onMoveTodo,
  onAddTodo,
  onDeleteTodo,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case PENDING:
        return (
          <>
            <ClockCircleOutlined style={{ color: '#69b1ff', fontSize: '1.8rem'}} />
            <span className="ml-1" style={{ fontSize: '1.8rem' }} >{status}</span>
          </>
        );
      case IN_PROGRESS:
        return (
          <>
            <SyncOutlined style={{ color: '#ffc069', fontSize: '1.8rem' }} />
            <span className="ml-1" style={{ fontSize: '1.8rem' }} >{status}</span>
          </>
        );
      case COMPLETED:
        return (
          <>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '1.8rem' }} />
            <span className="ml-1" style={{ fontSize: '1.8rem' }} >{status}</span>
          </>
        );
      default:
        return null;
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Col span={8}>
      <Card
        title={getStatusIcon(status)}
        className="mb-2"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            Add
          </Button>
        }
      >
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onMoveTodo={onMoveTodo}
            onDeleteTodo={onDeleteTodo}
          />
        ))}
        {todos.length === 0 && (
          <div className=''>This column is empty. Let’s add a task!</div>
        )}
      </Card>

      <TodoForm
        onAddTodo={onAddTodo}
        open={isModalVisible}
        onCancel={handleCancel}
      />
      
    </Col>
  );
};

export default Column;
