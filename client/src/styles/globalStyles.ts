import Logo from '../../public/images/logos/checkuree_logo.svg';
import DetailOpen from '../../public/images/icons/ico-detail-open.svg';

// Types
type ColorKey =
    | 'CheckureeGreen'
    | 'LightGreen'
    | 'Orange'
    | 'Red'
    | 'White'
    | 'Black01'
    | 'Gray80'
    | 'Gray60'
    | 'Gray40';

export const Colors: Record<ColorKey, string> = {
    CheckureeGreen: '#59996B',
    LightGreen: '#EDF9E3',
    Orange: '#EDC588',
    Red: '#E9B3B3',
    White: '#ffffff',
    Black01: '#222222',
    Gray80: '#8E8E8E',
    Gray60: '#C9C9C9',
    Gray40: '#D9D9D9',
};

export const Icons: Record<string, { src: string; type: string }> = {
    groups: { src: 'groups', type: 'material-icons-outlined' },
    sentiment_satisfied_alt: {
        src: 'sentiment_satisfied_alt',
        type: 'material-icons-outlined',
    },
    watch_later: { src: 'watch_later', type: 'material-icons-outlined' },
    highlight_off: { src: 'highlight_off', type: 'material-icons-outlined' },
};

export const Images: Record<string, string> = { Logo, DetailOpen };
