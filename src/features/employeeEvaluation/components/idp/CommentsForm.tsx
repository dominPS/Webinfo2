import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextAreaContainer, TextAreaLabel, StyledTextArea } from './IDPStyledComponents';

interface CommentsFormProps {
  leaderComment: string;
  onLeaderCommentChange: (value: string) => void;
  hrComment?: string;
  onHRCommentChange?: (value: string) => void;
  showHRComment?: boolean;
}

export const CommentsForm: React.FC<CommentsFormProps> = ({
  leaderComment,
  onLeaderCommentChange,
  hrComment = '',
  onHRCommentChange,
  showHRComment = false
}) => {
  const { t } = useTranslation();

  return (
    <>
      <TextAreaContainer>
        <TextAreaLabel htmlFor="leaderComment">
          {t('employee.evaluation.idp.leader_comment')}
        </TextAreaLabel>
        <StyledTextArea
          id="leaderComment"
          value={leaderComment}
          onChange={(e) => onLeaderCommentChange(e.target.value)}
          placeholder={t('employee.evaluation.idp.leader_comment_placeholder')}
        />
      </TextAreaContainer>

      {showHRComment && (
        <TextAreaContainer>
          <TextAreaLabel htmlFor="hrComment">
            {t('employee.evaluation.idp.hr_comment')}
          </TextAreaLabel>
          <StyledTextArea
            id="hrComment"
            value={hrComment}
            onChange={(e) => onHRCommentChange?.(e.target.value)}
            placeholder={t('employee.evaluation.idp.hr_comment_placeholder')}
          />
        </TextAreaContainer>
      )}
    </>
  );
};
