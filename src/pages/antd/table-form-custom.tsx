import { useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Input, Space, Tag } from 'antd';
export const waitTime = async (time: number = 100) => {
  await new Promise((resolve) => { setTimeout(resolve, time); });
};

type GithubIssueItem = {
  url: string;
  id: number;
  title: string;
};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: '标题',
    dataIndex: 'title',
  },
  {
    title: '扩展项',
    key: 'custom',
    hideInTable: true,
    dataIndex: 'custom',
    renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
      const stateType = form.getFieldValue('state');
      if (stateType === 30) {
        return null;
      }
      return <Input {...rest} />;
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
      request={async (params, sort, filter) => {
        console.log(params, sort, filter);
        await waitTime(1000);
        const url = new URL('https://proapi.azurewebsites.net/github/issues');
        for (const [k, v] of Object.entries(params)) {
          url.searchParams.append(k, String(v));
        }
        return fetch(url).then(r => r.json()) as Promise<{
          data: GithubIssueItem[];
        }>;
      }}
      editable={{ type: 'multiple', }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
    />
  );
};