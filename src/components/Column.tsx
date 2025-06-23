import React from 'react';
import { Card, Col } from 'antd';
import TodoItem from './TodoItem';
import type { Todo } from '../types';

interface ColumnProps {
  status: Todo['status'];
  todos: Todo[];
  onMoveTodo: (id: string, status: Todo['status']) => void;
}

const Column: React.FC<ColumnProps> = ({ status, todos, onMoveTodo }) => {
  return (
    <Col span={8}>
      <Card
        title={status}
        style={{ marginBottom: '16px' }}
      >
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onMoveTodo={onMoveTodo}
          />
        ))}
      </Card>
    </Col>
  );
};

export default Column;