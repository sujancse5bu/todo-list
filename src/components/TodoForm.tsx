import React, { useEffect, useState } from 'react';
import { Input, Button, Form, Modal, Row, Select, DatePicker } from 'antd';
import type { Status, Todo } from '../types';
import { Statuses } from '../types/status';
import moment from 'moment';

const { PENDING, IN_PROGRESS, COMPLETED } = Statuses;

interface TodoFormProps {
  onAddTodo: (todo: Todo) => void;
  modalVisibleFor: string;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  description: string;
  status: Status;
  dueDate?: Date;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo, modalVisibleFor, onCancel }) => {
  const [form] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState(modalVisibleFor)
  const [maxId, setMaxId] = useState<number>(0)

  useEffect(() => {
    setSelectedStatus(modalVisibleFor)
  }, [modalVisibleFor])

  useEffect(() => {
    const storedMaxId = localStorage.getItem('maxId');
    if (storedMaxId) {
      setMaxId(parseInt(storedMaxId, 10));
    }
  }, []);

  const handleSubmit = (values: FormValues) => {
    const newTodo: Todo = {
      id: maxId + 1,
      title: values.title,
      description: values.description,
      status: values.status,
      dueDate: values.dueDate,
    };
    onAddTodo(newTodo);
    form.resetFields()
    onCancel()
  };

  return (
    <Modal
      title="Add Todo"
      open={modalVisibleFor.length > 0}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          title: '',
          description: '',
          status: modalVisibleFor || PENDING,
        }}
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

        <Form.Item
          label="Status"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          name="status"
          rules={[{ required: true, message: 'Please select the status!' }]}
        >
          <Select
            placeholder="Select Status"
            onChange={(value) => {
              setSelectedStatus(value);
            }}
          >
            <Select.Option value={PENDING}>Pending</Select.Option>
            <Select.Option value={IN_PROGRESS}>In Progress</Select.Option>
            <Select.Option value={COMPLETED}>Completed</Select.Option>
          </Select>
        </Form.Item>

        {selectedStatus === IN_PROGRESS && (
          <Form.Item
            label="Due Date"
            name="dueDate"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[{ required: selectedStatus === IN_PROGRESS, message: 'Please select a due date!' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss A"
              placeholder="Select Due Date"
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>
        )}

        <Row justify="end">
          <Button key="back" type="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button key="submit" type="primary" htmlType="submit" className='ml-1'>
            Add Todo
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

export default TodoForm;
