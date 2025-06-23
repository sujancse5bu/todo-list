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
import { useDrop } from 'react-dnd';

const { PENDING, IN_PROGRESS, COMPLETED } = Statuses;

interface ColumnProps {
  status: Status;
  todos: Todo[];
  onMoveTodo: (id: number, status: Status) => void;
  onAddTodo: (newTodo: Todo) => void;
  onDeleteTodo: (id: number) => void;
}

const Column: React.FC<ColumnProps> = ({
  status,
  todos,
  onMoveTodo,
  onAddTodo,
  onDeleteTodo,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TODO',
    drop: (item: Todo) => {
      console.log('dropped item: ', item, status)
      onMoveTodo(item.id, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const [modalVisibleFor, setModalVisibleFor] = useState('');

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case PENDING:
        return (
          <>
            <ClockCircleOutlined style={{ color: '#69b1ff', fontSize: '1.8rem'}} />
            <span className="ml-1" style={{ fontSize: '1.8rem' }} >{status} ({todos.length})</span>
          </>
        );
      case IN_PROGRESS:
        return (
          <>
            <SyncOutlined style={{ color: '#ffc069', fontSize: '1.8rem' }} />
            <span className="ml-1" style={{ fontSize: '1.8rem' }} >{status} ({todos.length})</span>
          </>
        );
      case COMPLETED:
        return (
          <>
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '1.8rem' }} />
            <span className="ml-1" style={{ fontSize: '1.8rem' }} >{status} ({todos.length})</span>
          </>
        );
      default:
        return null;
    }
  };

  const showModal = () => {
    setModalVisibleFor(status);
  };

  const handleCancel = () => {
    setModalVisibleFor('');
  };

  return (
    <Col
      span={8}
      ref={drop}
    >
      <Card
        title={getStatusIcon(status)}
        className="mb-2"
        style={{
          boxShadow: isOver ? '0 0 1rem 0.3rem #1677ff' : ''
        }}
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
        modalVisibleFor={modalVisibleFor}
        onCancel={handleCancel}
      />
      
    </Col>
  );
};

export default Column;
