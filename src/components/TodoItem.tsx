import React from 'react';
import { Card, Popover, Button } from 'antd';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onMoveTodo: (id: string, status: Todo['status']) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onMoveTodo }) => {
  const { title, description, status, id } = todo;

  const handleMove = (newStatus: Todo['status']) => {
    if (newStatus !== status) {
      onMoveTodo(id, newStatus);
    }
  };

  const contextMenu = (
    <div>
      {status !== 'New' && <Button onClick={() => handleMove('New')}>Move to New</Button>}
      {status !== 'Ongoing' && <Button onClick={() => handleMove('Ongoing')}>Move to Ongoing</Button>}
      {status !== 'Done' && <Button onClick={() => handleMove('Done')}>Move to Done</Button>}
    </div>
  );

  return (
    <Popover content={contextMenu} trigger="contextMenu">
      <Card title={title} bordered={false}>
        <p>{description}</p>
        <span style={{ color: getStatusColor(status) }}>{status}</span>
      </Card>
    </Popover>
  );
};

const getStatusColor = (status: Todo['status']) => {
  switch (status) {
    case 'New':
      return 'blue';
    case 'Ongoing':
      return 'orange';
    case 'Done':
      return 'green';
    default:
      return 'black';
  }
};

export default TodoItem;