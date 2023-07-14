import { FormHTMLAttributes } from 'react';

import searchIcon from '@assets/search_black.svg';

import { Size } from '../AddButton/type';

import * as S from './style';

interface SearchBarProps extends FormHTMLAttributes<HTMLFormElement> {
  size: Size | 'free';
}

export default function SearchBar({ size, ...rest }: SearchBarProps) {
  return (
    <S.Form size={size} {...rest}>
      <S.Input type="text" />
      <S.Button type="submit">
        <img src={searchIcon} alt="검색버튼" />
      </S.Button>
    </S.Form>
  );
}
