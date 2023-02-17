import React, { CSSProperties } from 'react';
import { ReactNode } from 'react';
import { Select as SelectAntd, SelectProps as SelectAntdProps } from 'antd';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Icon from '../Icon/Icon';
import classNames from 'classnames';
import { Input as InputAntd, InputProps as InputAntdProps } from 'antd';
import { string } from 'prop-types';

export interface ExtendedSelectInputProps extends SelectAntdProps {
  width?: number | string;
  selectWidth?: number | string;
  inputWidth?: number | string;
  className?: string;
  compareList?: { label: any; value: any }[];
  placeholder?: string;
  prefix?: any;
  suffix?: any;
  defaultValue?: string;
}

export type SelectInputProps = ExtendedSelectInputProps & InputAntdProps;

const SelectInput = (props: SelectInputProps) => {
  const {
    width,
    selectWidth,
    inputWidth,
    className,
    compareList,
    placeholder,
    prefix,
    suffix,
    defaultValue,
    ...rest
  } = props;

  return (
    <div
      className={classNames('flex rounded select-input', className)}
      style={{ width: width }}
    >
      <Select width={selectWidth} options={compareList} {...rest} defaultValue={defaultValue}/>
      <Input
        type="text"
        placeholder={placeholder}
        width={inputWidth}
        suffix={suffix}
        prefix={prefix}
      />
    </div>
  );
};

export default SelectInput;
