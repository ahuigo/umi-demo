import { Checkbox, Card, Row, Col } from 'antd';

type Options = Record<string, boolean>;
export interface Props {
  options: Options;
  onChange: (res: Options) => void;
  className?: string;
}


export default function ({ options, onChange, className }: Props) {
  const onAllowTypeChanged = (type: string, flag: boolean) => {
    onChange({ [type]: flag });
  };

  return (
    <Card
      title="Connecting Settings"
      size="small"
      className={className}
      bordered={false}
      style={{ width: 240 }}
    >
      <Row align="middle">
        {Object.entries(options).map(([key, value]) => {
          return <Col span={24}>
            <Checkbox
              key={key}
              checked={value}
              onChange={(e) =>
                onAllowTypeChanged(key, e.target.checked)
              }
            >
              {key}
            </Checkbox>
          </Col>;
        })}
      </Row>
    </Card>
  );
}