import React, { ChangeEvent, useState } from 'react';

import { MAX_FILE_SIZE } from '@components/PostForm/constants';

import { convertImageToWebP } from '@utils/resizeImage';

const MAX_WRITING_LENGTH = 50;

export interface WritingVoteOptionType {
  id: number;
  text: string;
  imageUrl: string;
}

const MIN_COUNT = 2;
const MAX_COUNT = 5;

const INIT_OPTION_LIST = [
  { id: Math.floor(Math.random() * 100000), text: '', imageUrl: '' },
  { id: Math.floor(Math.random() * 100000), text: '', imageUrl: '' },
];

export const useWritingOption = (initialOptionList: WritingVoteOptionType[] = INIT_OPTION_LIST) => {
  const [optionList, setOptionList] = useState(initialOptionList);

  const addOption = () => {
    if (optionList.length >= MAX_COUNT) return;

    const updatedOptionList = [
      ...optionList,
      { id: Math.floor(Math.random() * 100000), text: '', imageUrl: '' },
    ];

    setOptionList(updatedOptionList);
  };

  const writingOption =
    (optionId: number) => (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { value } = event.target;
      const standard = value.length;

      if (standard === MAX_WRITING_LENGTH) {
        event.target.setCustomValidity(
          `선택지 내용은 ${MAX_WRITING_LENGTH}자까지 입력 가능합니다.`
        );
        event.target.reportValidity();
        return;
      }

      const updateOptionList = optionList.map(optionItem => {
        return optionItem.id !== optionId
          ? optionItem
          : {
              ...optionItem,
              text: value,
            };
      });

      event.target.setCustomValidity('');
      setOptionList(updateOptionList);
    };

  const deleteOption = (optionId: number) => {
    if (optionList.length <= MIN_COUNT) return;

    const removedOptionList = optionList.filter(optionItem => optionItem.id !== optionId);

    setOptionList(removedOptionList);
  };

  const removeImage = (optionId: number) => {
    const updatedOptionList = optionList.map(optionItem => {
      if (optionItem.id === optionId) {
        return { ...optionItem, imageUrl: '' };
      }

      return optionItem;
    });

    setOptionList(updatedOptionList);
  };

  const handleUploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
    optionId: number
  ) => {
    const { files } = event.target;

    if (!files) return;

    const file = files[0];

    const webpFileList = await convertImageToWebP(file);

    event.target.files = webpFileList;

    const reader = new FileReader();

    const webpFile = webpFileList[0];

    reader.readAsDataURL(webpFile);

    event.target.setCustomValidity('');

    if (file.size > MAX_FILE_SIZE) {
      event.target.setCustomValidity('사진의 용량은 1.5MB 이하만 가능합니다.');
      event.target.reportValidity();

      return;
    }

    reader.onloadend = () => {
      const updatedOptionList = optionList.map(optionItem => {
        if (optionItem.id === optionId) {
          return { ...optionItem, imageUrl: reader.result?.toString() ?? '' };
        }

        return optionItem;
      });

      setOptionList(updatedOptionList);
    };
  };

  return { optionList, addOption, writingOption, deleteOption, removeImage, handleUploadImage };
};
