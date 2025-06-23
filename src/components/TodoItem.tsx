import React from 'react';
import { Popover, Button, Collapse, type CollapseProps } from 'antd';
import { useDrag } from 'react-dnd';
import type { Status, Todo } from '../types';
import { Statuses } from '../types/status';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface TodoItemProps {
  todo: Todo;
  onMoveTodo: (id: number, status: Status) => void;
  onDeleteTodo: (id: number) => void;
}

const {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
} = Statuses;

const TodoItem: React.FC<TodoItemProps> = ({ todo, onMoveTodo, onDeleteTodo }) => {
  const { title, description, status, id } = todo;
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TODO',
    item: { id, status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

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
          <strong>
            <span style={{
              backgroundColor: '#FFF',
              padding: '0.2rem 0.8rem',
              borderRadius: '4rem',
              marginRight: '0.7rem'
            }}>
              {id}
            </span>{' '}
            {title}
          </strong>
        </div>
      </Popover>
    ),
    children: (
      <Popover content={contextMenu} trigger="contextMenu">
        <div className=" m-0 p-2" style={{ backgroundColor: colors.body }}>
          <p>{description}</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            gap: '1rem',
            padding: '1rem 2rem',
            backgroundColor: colors.body,
            borderRadius: '0 0 0.8rem 0.8rem'
          }}
        >
          <Button icon={<EditOutlined />} onClick={() => { }}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => onDeleteTodo(id)} danger>
            Delete
          </Button>
        </div>
      </Popover>
    ),
  }];


  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Collapse
        accordion
        items={panelItems}
        expandIconPosition="end"
        className='todo-item mb-1 p-0'
        style={{ backgroundColor: colors.header }}
      />
    </div>
  );
};

export default TodoItem;
