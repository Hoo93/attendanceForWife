// Libraries
import { cx } from '@emotion/css';

// Styles
import IconContainer from '@/components/Icon/styles';

// Types
type GenericFunction = () => void;
interface IconType {
    icon: { type: string; src: string };
    size?: number;
    color?: string;
    cns?: string;
    onClick?: GenericFunction;
}

const Icon = (props: IconType) => {
    const { icon, size, color, cns, onClick } = props;
    return (
        <IconContainer
            className={cx(
                `common-icon ${icon?.type || 'material-icons-outlined'}`,
                cns
            )}
            size={size}
            color={color}
            aria-disabled
            onClick={onClick}
        >
            {icon?.src}
        </IconContainer>
    );
};

export default Icon;
