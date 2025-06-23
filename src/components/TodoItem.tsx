import React from 'react';
import { Popover, Button, Collapse, type CollapseProps } from 'antd';
import type { Status, Todo } from '../types';
import { Statuses } from '../types/status';
import { CloseCircleOutlined } from '@ant-design/icons';

interface TodoItemProps {
  todo: Todo;
  onMoveTodo: (id: string, status: Status) => void;
  onDeleteTodo: (id: string) => void;
}

const {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
} = Statuses;

const TodoItem: React.FC<TodoItemProps> = ({ todo, onMoveTodo, onDeleteTodo }) => {
  const { title, description, status, id } = todo;
  const colors = {
    header: status === PENDING ? '#69b1ff' : status === IN_PROGRESS ? '#ffc069' : status === COMPLETED ? '#95de64' : '#FFF',
    body: status === PENDING ? '#bae0ff' : status === IN_PROGRESS ? '#ffffb8' : status === COMPLETED ? '#d9f7be' : '#FFF',
  }

  const handleMove = (newStatus: Status) => {
    if (newStatus !== status) {
      onMoveTodo(id, newStatus);
    }
  };

  const contextMenu = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {status !== PENDING && <Button type='dashed' onClick={() => handleMove(PENDING)}>Move to New</Button>}
      {status !== IN_PROGRESS && <Button type='dashed' onClick={() => handleMove(IN_PROGRESS)}>Move to Ongoing</Button>}
      {status !== COMPLETED && <Button type='dashed' onClick={() => handleMove(COMPLETED)}>Move to Done</Button>}
    </div>
  );

  const panelItems: CollapseProps['items'] = [{
    key: id,
    label: (
      <Popover content={contextMenu} trigger="contextMenu">
        <div>
          <span>
            <strong>{title}</strong>
            <CloseCircleOutlined
              onClick={() => onDeleteTodo(id)}
              style={{
                color: 'red',
                cursor: 'pointer',
                float: 'right',
                fontSize: '2rem',
              }}
            />
          </span>
        </div>
      </Popover>
    ),
    children: (
      <Popover content={contextMenu} trigger="contextMenu">
        <div
          className="item-body m-0 p-2"
          style={{ backgroundColor: colors.body }}
        >
          <p>{description}</p>
        </div>
      </Popover>
    ),
  }];


  return (
    <Collapse
      accordion
      items={panelItems}
      expandIconPosition="start"
      className='todo-item mb-1 p-0'
      style={{ backgroundColor: colors.header }}
    />
  );
};

export default TodoItem;
