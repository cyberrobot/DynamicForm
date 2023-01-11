import { createStyles } from '../../../helpers';
import { font } from '../../../helpers/theme';

export const useStyles = createStyles(({ spacing }) => ({
  actionsContainer: {
    justifyContent: 'flex-end',
    marginTop: spacing.SPACE_6,
  },
  formHeader: {
    marginBottom: 0,
  },
  formControl: {
    marginBottom: spacing.SPACE_5,
    whiteSpace: 'break-spaces',
  },
  formControlRightLabel: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    lineHeight: spacing.SPACE_10,
    '& > [class*=error-message]': {
      flex: '0 0 100%',
    },
  },
  rightLabel: {
    marginBottom: 0,
    marginLeft: spacing.SPACE_2,
  },
  formLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.SPACE_4,
    whiteSpace: 'nowrap',
  },
  formLineBox: {
    flex: 1,
    justifyContent: 'stretch',
    display: 'flex',
  },
  heading: {
    marginBottom: spacing.SPACE_3,
    marginTop: spacing.SPACE_1,
    fontWeight: font.WEIGHT_SEMIBOLD,
    fontSize: font.SIZE_MD,
    width: '100%',
  },
  label: {
    marginBottom: spacing.SPACE_1,
    fontSize: font.SIZE_SM,
    fontWeight: font.WEIGHT_SEMIBOLD,
  },
}));
