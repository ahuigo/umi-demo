import { CloseCircleFilled, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Select, TreeSelect } from 'antd';
import { useRef } from 'react';

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          {
            value: 'leaf1',
            title: 'my leaf',
          },
          {
            value: 'yourleaf',
            title: 'your leaf',
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            value: 'sss',
            title: <b style={{ color: '#08c' }}>sss</b>,
          },
        ],
      },
    ],
  },
];
type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: '标题',
    dataIndex: 'title',
    tip: '标题过长会自动收缩',
    renderFormItem: (_, { defaultRender, record }) => {
      return defaultRender(_);
    },
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: 'tags',
    dataIndex: 'tags',
    renderFormItem: (_, { defaultRender }) => {
      return (<Select mode="tags" />);
    },
  },
  {
    title: 'tree',
    dataIndex: 'tree',
    renderFormItem: (_, { defaultRender }) => {
      return (
        <TreeSelect
          multiple
          showSearch
          // onKeyDown={handleKeyDown}
          // options={tagOptions}
          treeDefaultExpandAll
          treeData={treeData}
        />
      );
    },
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'state',
    valueType: 'select',//https://procomponents.ant.design/components/schema#valuetype-%E5%88%97%E8%A1%A8
    valueEnum: {
      all: { text: '超长'.repeat(3) },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true,
      },
    },
  },
  {
    title: '时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      rowKey="id"
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      search={{
        defaultCollapsed: false,
      }}
      form={{
        initialValues: {
          title: 'test', tags: ['a', 'b'],
          tree: ['leaf1', 'yourleaf'],
        },
        onValuesChange: (changedValues, allValues) => {
          console.log(changedValues); // values that have changed
        },
      }}
      dateFormatter="string"
    />
  );
};