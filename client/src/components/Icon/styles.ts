// Libraries
import styled from '@emotion/styled';

// Styles
import { Colors } from '@/styles/globalStyles';

interface IconProps {
    size?: number;
    color?: string;
}

const IconContainer = styled.span<IconProps>`
    font-family: 'Material Icons Outlined', serif;
    font-size: ${(props) =>
        props.size ? `${props.size}px` : '24px'}!important;
    color: ${(props) => (props.color ? Colors[props.color] : Colors.Black)};
    display: grid;
    place-items: center;
`;

export default IconContainer;
