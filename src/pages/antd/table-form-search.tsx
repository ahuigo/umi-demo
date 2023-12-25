import { CloseCircleFilled, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Input, Space, Tag } from 'antd';
import { useRef } from 'react';
export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
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
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      editable={{ type: 'multiple', }}
      rowKey="id"
      dateFormatter="string"
      headerTitle="高级表格"
      request={async (params, sort, filter) => {
        console.log(params, sort, filter);
        await waitTime(1000);
        const url = new URL('https://proapi.azurewebsites.net/github/issues');
        for (const [k, v] of Object.entries(params)) {
          url.searchParams.append(k, String(v));
        }
        return { data: [], total: 0 };
        return fetch(url).then(r => r.json()) as Promise<{
          data: GithubIssueItem[];//data/total
        }>;
      }}
      search={{
        labelWidth: 'auto',
        defaultCollapsed: false,
        optionRender: (searchConfig, formProps, dom) => [
          ...dom.reverse(),
          <Button> 导出 </Button>,
        ],
      }}
    />
  );
};