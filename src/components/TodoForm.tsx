import React, { useState } from 'react';
import { Input, Button, Form, Modal } from 'antd';
import type { Todo } from '../types';
import { Statuses } from '../types/status';

interface TodoFormProps {
  onAddTodo: (todo: Todo) => void;
  visible: boolean;
  onCancel: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo, visible, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      status: Statuses.PENDING,
    };
    onAddTodo(newTodo);
    setTitle('');
    setDescription('');
    onCancel();  // Close modal after form submission
  };

  return (
    <Modal
      title="Add Todo"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button
          key="back"
          type='default'
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Add Todo
        </Button>,
      ]}
    >
      <Form onFinish={handleSubmit}>
        <Form.Item
          label="Title"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter Title'
          />
        </Form.Item>
        <Form.Item
          label="Description"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Enter Description'
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TodoForm;
