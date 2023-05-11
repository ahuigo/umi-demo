import { Checkbox, Card, Row, Col, Input, InputNumber, Slider } from 'antd';
// import type { CheckboxOptionType } from 'antd';
type CheckboxValueType = string | number

type ObjectSlide = {
  type: 'slide';
  min: number,
  max: number,
  value: number,
  step?: number,
};
type ObjectCheckGroup = { options: Array<CheckboxValueType>, value?: CheckboxValueType[], type: 'checkgroup'; };
type ValType = boolean | string | number | ObjectSlide | ObjectCheckGroup;
type Options<T = boolean> = { [key: string]: T; };
export interface Props<T> {
  options: Options<T>;
  onChange: (res: Options<T>) => void;
  className?: string;
}

function EditItem({ prop: prop, value, onChange }: { prop: string, value: ValType, onChange: (key: string, value: ValType) => void; }) {
  if (typeof value === 'boolean') {
    return <Checkbox checked={value} onChange={(e) => onChange(prop, e.target.checked)} >
      {prop}
    </Checkbox>;
  } else if (typeof value === 'number') {
    return <Input type="number" min={0} max={9999} value={value} onChange={(e) => {
      onChange(prop, +e.target.value);
    }} />;
  } else if (typeof value === 'object') {
    if (value.type === 'slide') {
      return <Slider {...value} onChange={(val) => {
        value.value = +val;
        onChange(prop, value);
      }} />;
    } else if (value.type === 'checkgroup') {
      return <Checkbox.Group options={value.options} value={value.value} onChange={(val) => {
        // @ts-ignore
        value.value = val;
        onChange(prop, value);
      }} />;
    }
  }
  return <>
    {prop}:<Input value={value as string}
      onChange={
        (e) => onChange(prop, e.target.value)
      }
    />
  </>;
}

export function OptionsEdit<T extends ValType>({ options, onChange, className }: Props<T>) {
  const onOptionChanged = (type: string, flag: ValType) => {
    onChange({
      ...options,
      [type]: flag as T,
    });
  };

  return (
    <Card
      title="Settings"
      size="small"
      className={className}
      bordered={false}
      style={{ width: 240 }}
    >
      <Row align="middle">
        {Object.entries(options).map(([key, value]) => {
          return (<Col key={key} span={24}>
            {typeof value === 'boolean' ? '' : `${key}:`}<EditItem prop={key} value={value} onChange={onOptionChanged} />
          </Col>);
        })}
      </Row>
    </Card>
  );
}
export default OptionsEdit;