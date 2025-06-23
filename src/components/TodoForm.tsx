import React, { useEffect, useState } from 'react';
import { Input, Button, Form, Modal, Row, Select, DatePicker } from 'antd';
import type { Status, Todo } from '../types';
import { Statuses } from '../types/status';
import dayjs from 'dayjs';

const { PENDING, IN_PROGRESS, COMPLETED } = Statuses;

interface TodoFormProps {
  onAddTodo: (todo: Todo) => void;
  onUpdateTodo: (id: number, todo: Todo) => void;
  modalVisibleFor: string;
  onCancel: () => void;
  selectedForEdit: Todo | undefined;
  setSelectedForEdit: React.Dispatch<React.SetStateAction<Todo | undefined>>;
}

interface FormValues {
  title: string;
  description: string;
  status: Status;
  dueDate?: Date;
}

const dateFormat = "YYYY-MM-DD HH:mm:ss A";

const TodoForm: React.FC<TodoFormProps> = ({
  onAddTodo,
  onUpdateTodo,
  modalVisibleFor,
  onCancel,
  selectedForEdit,
  setSelectedForEdit,
}) => {
  const [form] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState(modalVisibleFor);

  useEffect(() => {
    if (selectedForEdit !== undefined) {
      form.setFieldsValue({
        title: selectedForEdit.title,
        description: selectedForEdit.description,
        status: selectedForEdit.status,
      });
      setSelectedStatus(selectedForEdit.status);

      if (selectedForEdit.status === IN_PROGRESS) {
        form.setFieldsValue({
          dueDate: dayjs(selectedForEdit.dueDate || new Date()),
        });
      }
    }
  }, [selectedForEdit, form]);

  useEffect(() => {
    setSelectedStatus(modalVisibleFor);
  }, [modalVisibleFor]);

  const getMaxId = () => {
    const storedTodos = localStorage.getItem('todos');
    const todos = storedTodos ? JSON.parse(storedTodos) as Todo[] : [];
    return todos.reduce((max, todo) => (todo.id > max ? todo.id : max), 0);
  };

  const handleSubmit = (values: FormValues) => {
    const newTodo: Todo = {
      id: selectedForEdit ? selectedForEdit.id : getMaxId() + 1,
      title: values.title,
      description: values.description,
      status: values.status,
      dueDate: values.dueDate,
    };
    if (selectedForEdit) {
      onUpdateTodo(selectedForEdit.id, newTodo)
    } else {
      onAddTodo(newTodo);
    }
    
    form.resetFields();
    setSelectedForEdit(undefined);
    onCancel();
  };

  return (
    <Modal
      title={selectedForEdit ? 'Edit Todo' : 'Add Todo'}
      open={selectedForEdit !== undefined || modalVisibleFor.length > 0}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          title: selectedForEdit?.title || '',
          description: selectedForEdit?.description || '',
          status: selectedForEdit?.status || modalVisibleFor || PENDING,
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input placeholder="Enter Title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Input.TextArea placeholder="Enter Description" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
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
              format={dateFormat}
              placeholder="Select Due Date"
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}  // Use dayjs instead of moment
            />
          </Form.Item>
        )}

        <Row justify="end">
          <Button key="back" type="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button key="submit" type="primary" htmlType="submit" className="ml-1">
            Submit
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

export default TodoForm;
