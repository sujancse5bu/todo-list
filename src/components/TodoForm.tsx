import React from 'react';
import { Input, Button, Form, Modal, Row } from 'antd';
import type { Todo } from '../types';
import { Statuses } from '../types/status';

interface TodoFormProps {
  onAddTodo: (todo: Todo) => void;
  open: boolean;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  description: string;
}

const {
  PENDING,
  // IN_PROGRESS,
  // COMPLETED,
} = Statuses;

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo, open, onCancel }) => {
  const [form] = Form.useForm();
  const { resetFields } = form;

  const handleSubmit = (values: FormValues) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      title: values.title,
      description: values.description,
      status: PENDING,
    };
    onAddTodo(newTodo);
    resetFields()
    onCancel();
  };

  return (
    <Modal
      title="Add Todo"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{ title: '', description: '' }}
      >
        <Form.Item
          label="Title"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          name="title"
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input placeholder="Enter Title" />
        </Form.Item>
        <Form.Item
          label="Description"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          name="description"
        >
          <Input.TextArea placeholder="Enter Description" />
        </Form.Item>
        <Row justify="end">
          <Button
            key="back"
            type='default'
            onClick={onCancel}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" htmlType="submit">
            Add Todo
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

export default TodoForm;
