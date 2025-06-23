import React, { useEffect, useState } from 'react';
import { Popover, Button, Collapse, type CollapseProps, Modal, notification } from 'antd';
import { useDrag } from 'react-dnd';
import type { Status, Todo } from '../types';
import { Statuses } from '../types/status';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface TodoItemProps {
  todo: Todo;
  onUpdateTodo: (id: number, todo: Todo) => void;
  onDeleteTodo: (id: number) => void;
  setSelectedForEdit: React.Dispatch<React.SetStateAction<Todo | undefined>>
}

const {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
} = Statuses;

let intervalId: number | undefined = undefined

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdateTodo,
  onDeleteTodo,
  setSelectedForEdit
}) => {
  const { title, description, status, id, dueDate } = todo;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string>('00:00:00');

  useEffect(() => {
    const targetDate = dayjs(dueDate);
    const currentDate = dayjs();
    if (status === IN_PROGRESS && targetDate.isAfter(currentDate)) {
      const updateTime = () => {
        const now = dayjs();
        const target = dayjs(dueDate);
        const diff = target.diff(now, 'seconds');

        if (diff <= 0) {
          setRemainingTime('00:00:00');
          clearInterval(intervalId);
          notification.warning({
            message: 'Warning!!!',
            description: <span>This task: <b>"{title}"</b> is overdue. Please take action.</span>,
            placement: 'topRight',
          });
        } else {
          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          const seconds = diff % 60;

          setRemainingTime(
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          );
        }
      };
      intervalId = setInterval(updateTime, 1000);
    }
    
    return () => {
      clearInterval(intervalId);
    };
  }, [dueDate, status, title]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TODO',
    item: todo,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };
  const handleDeleteCancel = () => {
    setIsModalVisible(false);
  };
  const handleConfirmDelete = () => {
    onDeleteTodo(id);
    setIsModalVisible(false);
  };

  const colors = {
    header: status === PENDING ? '#bae0ff' : status === IN_PROGRESS ? '#fff1b8' : status === COMPLETED ? '#d9f7be' : '#FFF',
    body: '#F6FFF8'
  }

  const handleMove = (newStatus: Status) => {
    if (newStatus !== status) {
      onUpdateTodo(id, {
        ...todo,
        status: newStatus
      });
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto'}}>
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
          {dueDate && status === IN_PROGRESS && remainingTime === '00:00:00' ? (
            <span style={{ color: 'red' }}>Overdue</span>
          ) : dueDate && status === IN_PROGRESS ? (
            <span>Due Time: {remainingTime}</span>
          ) : <></>}
        </div>
      </Popover>
    ),
    children: (
      <Popover content={contextMenu} trigger="contextMenu">
        {description && (
          <div className=" m-0 p-2" style={{ backgroundColor: colors.body }}>
            <p>{description}</p>
          </div>
        )}
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
          <Button icon={<EditOutlined />} onClick={() => setSelectedForEdit(todo)}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} onClick={showDeleteModal} danger>
            Delete
          </Button>
        </div>
      </Popover>
    ),
  }];


  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.8 : 1 }}
    >
      <Collapse
        accordion
        items={panelItems}
        expandIconPosition="end"
        className='todo-item mb-1 p-0'
        style={{ backgroundColor: colors.header }}
      />

      <Modal
        title="Confirm Deletion"
        open={isModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleDeleteCancel}
        okText="Delete"
        okType='danger'
        cancelText="Cancel"
        closable={false}
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </div>
  );
};

export default TodoItem;
